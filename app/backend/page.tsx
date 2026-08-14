"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Globe, Database, Lock, Layers, Wifi, Shield,
  Server, Monitor, ChevronRight, Zap, Play, Square,
} from "lucide-react";
import { useLangStore } from "@/app/playground/store";
import { BACKEND_I18N, BackendTranslations } from "@/lib/i18n/backend";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "http" | "rest" | "database" | "auth" | "middleware" | "websocket" | "cors";

const TABS: { id: TabId; icon: React.ReactNode; color: string; glow: string; border: string; tag: string }[] = [
  { id: "http",       icon: <Globe size={15} />,    color: "text-blue-400",    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",   border: "border-blue-500/30",   tag: "blue" },
  { id: "rest",       icon: <Server size={15} />,   color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",  border: "border-emerald-500/30", tag: "emerald" },
  { id: "database",   icon: <Database size={15} />, color: "text-purple-400",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]", border: "border-purple-500/30",  tag: "purple" },
  { id: "auth",       icon: <Lock size={15} />,     color: "text-yellow-400",  glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",  border: "border-yellow-500/30",  tag: "yellow" },
  { id: "middleware", icon: <Layers size={15} />,   color: "text-orange-400",  glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]", border: "border-orange-500/30",  tag: "orange" },
  { id: "websocket",  icon: <Wifi size={15} />,     color: "text-pink-400",    glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",  border: "border-pink-500/30",    tag: "pink" },
  { id: "cors",       icon: <Shield size={15} />,   color: "text-cyan-400",    glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",   border: "border-cyan-500/30",    tag: "cyan" },
];

// ─── JS Code component ────────────────────────────────────────────────────────

function JSCode({ lines }: { lines: string[] }) {
  const keywords = ["const", "let", "var", "function", "async", "await", "return", "if", "else", "new", "require", "import", "from", "export"];
  return (
    <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-[#161b22]">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[10px] text-gray-600 font-mono">server.js</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-[1.7] overflow-x-auto">
        {lines.map((line, i) => {
          const parts: { text: string; cls: string }[] = [];
          let remaining = line;

          // Simple tokenizer
          const addPart = (text: string, cls: string) => parts.push({ text, cls });

          // Comment
          if (remaining.trim().startsWith("//")) {
            addPart(remaining, "text-gray-600 italic");
          } else {
            // Strings
            const strRe = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g;
            let lastIdx = 0;
            let m: RegExpExecArray | null;
            while ((m = strRe.exec(remaining)) !== null) {
              const before = remaining.slice(lastIdx, m.index);
              if (before) {
                // Tokenize before for keywords/numbers
                before.split(/(\b(?:const|let|var|function|async|await|return|if|else|new|require|import|from|export)\b|\b\d+\b)/).forEach(tok => {
                  if (keywords.includes(tok)) addPart(tok, "text-blue-400 font-semibold");
                  else if (/^\d+$/.test(tok)) addPart(tok, "text-orange-400");
                  else addPart(tok, "text-gray-300");
                });
              }
              addPart(m[0], "text-green-400");
              lastIdx = m.index + m[0].length;
            }
            const rest = remaining.slice(lastIdx);
            if (rest) {
              rest.split(/(\b(?:const|let|var|function|async|await|return|if|else|new|require|import|from|export)\b|\b\d+\b)/).forEach(tok => {
                if (keywords.includes(tok)) addPart(tok, "text-blue-400 font-semibold");
                else if (/^\d+$/.test(tok)) addPart(tok, "text-orange-400");
                else addPart(tok, "text-gray-300");
              });
            }
          }

          return (
            <div key={i} className="whitespace-pre">
              {parts.map((p, j) => <span key={j} className={p.cls}>{p.text}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-[#0d1117]/60 p-3 flex gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-bold text-gray-200 font-mono mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── HTTP SECTION ─────────────────────────────────────────────────────────────

function HTTPSection({ t }: { t: BackendTranslations }) {
  const [method, setMethod] = useState<"GET"|"POST"|"PUT"|"DELETE">("GET");
  const [phase, setPhase] = useState<"idle"|"request"|"db"|"response"|"done">("idle");
  const [statusCode, setStatusCode] = useState("");
  const [responseTime, setResponseTime] = useState(0);

  const statusMap: Record<string, { code: string; color: string }> = {
    GET:    { code: "200 OK",         color: "text-emerald-400" },
    POST:   { code: "201 Created",    color: "text-blue-400" },
    PUT:    { code: "200 OK",         color: "text-emerald-400" },
    DELETE: { code: "204 No Content", color: "text-orange-400" },
  };

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    POST: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    PUT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    DELETE: "bg-red-500/20 text-red-300 border-red-500/40",
  };

  const codeLines: Record<string, string[]> = {
    GET:    ["const express = require('express');", "const app = express();", "", "// GET — fetch all users", "app.get('/api/users', async (req, res) => {", "  const users = await db.query(", "    'SELECT * FROM users'", "  );", "  res.status(200).json(users);", "});"],
    POST:   ["// POST — create a new user", "app.post('/api/users', async (req, res) => {", "  const { name, email } = req.body;", "  const result = await db.query(", "    'INSERT INTO users (name, email) VALUES (?, ?)',", "    [name, email]", "  );", "  res.status(201).json({ id: result.insertId });", "});"],
    PUT:    ["// PUT — update user by id", "app.put('/api/users/:id', async (req, res) => {", "  const { name, email } = req.body;", "  await db.query(", "    'UPDATE users SET name=?, email=? WHERE id=?',", "    [name, email, req.params.id]", "  );", "  res.status(200).json({ updated: true });", "});"],
    DELETE: ["// DELETE — remove user by id", "app.delete('/api/users/:id', async (req, res) => {", "  await db.query(", "    'DELETE FROM users WHERE id = ?',", "    [req.params.id]", "  );", "  res.status(204).send();", "});"],
  };

  const sendRequest = async () => {
    const start = Date.now();
    setPhase("request");
    setStatusCode("");
    await new Promise(r => setTimeout(r, 700));
    setPhase("db");
    await new Promise(r => setTimeout(r, 600));
    setPhase("response");
    await new Promise(r => setTimeout(r, 500));
    setStatusCode(statusMap[method].code);
    setResponseTime(Date.now() - start);
    setPhase("done");
  };

  const FlowDot = ({ active, color }: { active: boolean; color: string }) => (
    <motion.div
      className={`w-2.5 h-2.5 rounded-full ${color}`}
      animate={active ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] } : { opacity: 0.25 }}
      transition={{ duration: 0.6, repeat: active ? Infinity : 0 }}
    />
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        {/* Method selector */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-gray-500 font-mono mb-3">{t.httpMethod}</p>
          <div className="flex flex-wrap gap-2">
            {(["GET", "POST", "PUT", "DELETE"] as const).map(m => (
              <button key={m}
                onClick={() => { setMethod(m); setPhase("idle"); setStatusCode(""); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all duration-150 ${
                  method === m ? methodColors[m] : "bg-surface-2 text-gray-500 border-border hover:border-gray-600"
                }`}>
                {m}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-600 font-mono">
            {t.httpEndpoint}: <span className="text-blue-400">/api/users{method === "PUT" || method === "DELETE" ? "/:id" : ""}</span>
          </div>
        </div>

        {/* Send button */}
        <button onClick={sendRequest} disabled={phase !== "idle" && phase !== "done"}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2">
          <Play size={14} />
          {t.httpSend}
        </button>

        {/* Status */}
        {statusCode && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-surface p-3 flex items-center gap-3">
            <div className={`text-sm font-bold font-mono ${statusMap[method].color}`}>{statusCode}</div>
            <div className="text-xs text-gray-500">{responseTime}ms</div>
          </motion.div>
        )}

        {/* Code */}
        <JSCode lines={codeLines[method]} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain */}
        <AnimatePresence mode="wait">
          <motion.div key={method} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-blue-400 font-bold font-mono">{method}</code>{" — "}{t.httpExplain[method]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Flow diagram */}
        <div className="rounded-2xl border border-border bg-[#0d1117] p-6 flex-1">
          <div className="flex flex-col gap-6 justify-center h-full">
            {/* Client → Server */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1.5 w-24 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Monitor size={20} className="text-blue-400" />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{t.httpClient}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FlowDot active={phase === "request"} color="bg-blue-400" />
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-500/60 to-transparent" />
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${ methodColors[method]} `}>{method}</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-blue-500/60 to-transparent" />
                </div>
                <div className="text-[10px] text-gray-600 font-mono text-center">/api/users</div>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-24 shrink-0">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  phase === "done" ? "bg-emerald-500/10 border-emerald-500/40" : "bg-surface-2 border-border"
                }`}>
                  <Server size={20} className={phase === "done" ? "text-emerald-400" : "text-gray-500"} />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{t.httpServer}</span>
                {phase === "done" && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`text-[9px] font-mono font-bold ${statusMap[method].color}`}>
                    {statusMap[method].code}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Server ↕ DB */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2 w-24">
                <div className="flex flex-col items-center gap-1">
                  <FlowDot active={phase === "db"} color="bg-purple-400" />
                  <div className="w-px h-6 bg-gradient-to-b from-purple-500/60 to-purple-500/20" />
                  <FlowDot active={phase === "db"} color="bg-purple-400" />
                </div>
              </div>
            </div>

            {/* DB */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  phase === "db" || phase === "response" || phase === "done" ? "bg-purple-500/10 border-purple-500/40" : "bg-surface-2 border-border"
                }`}>
                  <Database size={20} className={phase === "db" || phase === "done" ? "text-purple-400" : "text-gray-500"} />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{t.httpDatabase}</span>
              </div>
            </div>

            {/* Response */}
            {phase === "done" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 font-mono">{t.httpResponse}</span>
                  <span className={`text-xs font-bold font-mono ${statusMap[method].color}`}>{statusMap[method].code}</span>
                </div>
                <div className="font-mono text-[11px] text-gray-400 space-y-0.5">
                  {method === "GET" && (
                    <><div><span className="text-gray-600">[</span></div>
                    <div className="pl-3"><span className="text-gray-600">{"{ "}</span><span className="text-yellow-300">id</span><span className="text-gray-600">: </span><span className="text-orange-400">1</span><span className="text-gray-600">, </span><span className="text-yellow-300">name</span><span className="text-gray-600">: </span><span className="text-green-400">"Ali"</span><span className="text-gray-600">{" }"}</span></div>
                    <div><span className="text-gray-600">]</span></div></>
                  )}
                  {method === "POST" && (
                    <><div><span className="text-gray-600">{"{ "}</span><span className="text-yellow-300">id</span><span className="text-gray-600">: </span><span className="text-orange-400">42</span><span className="text-gray-600">, </span><span className="text-yellow-300">created</span><span className="text-gray-600">: </span><span className="text-green-400">true</span><span className="text-gray-600">{" }"}</span></div></>
                  )}
                  {method === "PUT" && (
                    <><div><span className="text-gray-600">{"{ "}</span><span className="text-yellow-300">updated</span><span className="text-gray-600">: </span><span className="text-green-400">true</span><span className="text-gray-600">{" }"}</span></div></>
                  )}
                  {method === "DELETE" && (
                    <div className="text-gray-500 italic">// 204 No Content — no body</div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.httpTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── REST SECTION ─────────────────────────────────────────────────────────────

function RESTSection({ t }: { t: BackendTranslations }) {
  const [method, setMethod] = useState<"GET"|"POST"|"PUT"|"DELETE">("GET");

  const methodConfig = {
    GET:    { color: "emerald", status: "200 OK",         icon: "📥", desc: "Read" },
    POST:   { color: "blue",    status: "201 Created",    icon: "📤", desc: "Create" },
    PUT:    { color: "yellow",  status: "200 OK",         icon: "✏️", desc: "Update" },
    DELETE: { color: "red",     status: "204 No Content", icon: "🗑️", desc: "Delete" },
  };

  const requestBodies: Record<string, { title: string; lines: string[] } | null> = {
    GET:    null,
    POST:   { title: "Request Body (JSON)", lines: ['{ "name": "Ali", "email": "ali@example.com" }'] },
    PUT:    { title: "Request Body (JSON)", lines: ['{ "name": "Ali Updated", "email": "new@example.com" }'] },
    DELETE: null,
  };

  const responseBodies: Record<string, string[]> = {
    GET:    ['[', '  { "id": 1, "name": "Ali", "email": "ali@example.com" },', '  { "id": 2, "name": "Vali", "email": "vali@example.com" }', ']'],
    POST:   ['{ "id": 42, "name": "Ali", "email": "ali@example.com", "createdAt": "2024-01-01" }'],
    PUT:    ['{ "id": 1, "name": "Ali Updated", "email": "new@example.com" }'],
    DELETE: ['// 204 No Content — empty response body'],
  };

  const codeLines: Record<string, string[]> = {
    GET:    ["// GET /api/users", "app.get('/api/users', async (req, res) => {", "  const users = await User.findAll();", "  res.status(200).json(users);", "});"],
    POST:   ["// POST /api/users", "app.post('/api/users', async (req, res) => {", "  const user = await User.create(req.body);", "  res.status(201).json(user);", "});"],
    PUT:    ["// PUT /api/users/:id", "app.put('/api/users/:id', async (req, res) => {", "  const user = await User.findByIdAndUpdate(", "    req.params.id, req.body, { new: true }", "  );", "  res.status(200).json(user);", "});"],
    DELETE: ["// DELETE /api/users/:id", "app.delete('/api/users/:id', async (req, res) => {", "  await User.findByIdAndDelete(req.params.id);", "  res.status(204).send();", "});"],
  };

  const mc = methodConfig[method];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        {/* Method buttons */}
        <div className="grid grid-cols-2 gap-2">
          {(["GET", "POST", "PUT", "DELETE"] as const).map(m => {
            const cfg = methodConfig[m];
            const isActive = method === m;
            return (
              <button key={m} onClick={() => setMethod(m)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? `bg-${cfg.color}-500/15 border-${cfg.color}-500/40 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                    : "bg-surface border-border hover:border-gray-600"
                }`}>
                <div className="text-2xl mb-1">{cfg.icon}</div>
                <div className={`font-mono font-bold text-sm ${
                  isActive ? (m === "GET" ? "text-emerald-400" : m === "POST" ? "text-blue-400" : m === "PUT" ? "text-yellow-400" : "text-red-400") : "text-gray-400"
                }`}>{m}</div>
                <div className="text-[10px] text-gray-600">{cfg.desc}</div>
              </button>
            );
          })}
        </div>

        {/* URL */}
        <div className="rounded-xl border border-border bg-[#0d1117] p-3 font-mono text-[11px]">
          <div className="text-gray-600 mb-1">{t.restHeaders}:</div>
          <div className="space-y-1">
            <div><span className="text-gray-500">Content-Type: </span><span className="text-orange-300">application/json</span></div>
            <div><span className="text-gray-500">Authorization: </span><span className="text-green-400">Bearer eyJhbGc...</span></div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="text-gray-600 mb-1">URL:</div>
            <div>
              <span className={`font-bold text-xs ${
                method === "GET" ? "text-emerald-400" : method === "POST" ? "text-blue-400" : method === "PUT" ? "text-yellow-400" : "text-red-400"
              }`}>{method}</span>
              <span className="text-gray-500"> /api/users{method === "PUT" || method === "DELETE" ? "/1" : ""}</span>
            </div>
          </div>
        </div>

        {/* Code */}
        <JSCode lines={codeLines[method]} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain */}
        <AnimatePresence mode="wait">
          <motion.div key={method} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className={`font-bold font-mono ${
                method === "GET" ? "text-emerald-400" : method === "POST" ? "text-blue-400" : method === "PUT" ? "text-yellow-400" : "text-red-400"
              }`}>{method}</code>{" — "}{t.restExplain[method]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Request + Response panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* Request */}
          <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
            <div className="px-3 py-2 border-b border-border/50 bg-[#161b22] flex items-center justify-between">
              <span className="text-[10px] text-gray-600 font-mono">{t.httpRequest}</span>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                method === "GET" ? "bg-emerald-500/20 text-emerald-300" : method === "POST" ? "bg-blue-500/20 text-blue-300" : method === "PUT" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"
              }`}>{method}</span>
            </div>
            <div className="p-3 font-mono text-[11px] text-gray-400 space-y-1">
              {requestBodies[method] ? (
                <>
                  <div className="text-gray-600 text-[10px] mb-1">{requestBodies[method]!.title}:</div>
                  {requestBodies[method]!.lines.map((l, i) => <div key={i} className="text-green-400">{l}</div>)}
                </>
              ) : (
                <div className="text-gray-600 italic">// No request body</div>
              )}
            </div>
          </div>
          {/* Response */}
          <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
            <div className="px-3 py-2 border-b border-border/50 bg-[#161b22] flex items-center justify-between">
              <span className="text-[10px] text-gray-600 font-mono">{t.httpResponse}</span>
              <span className="text-[10px] font-bold font-mono text-emerald-400">{mc.status}</span>
            </div>
            <div className="p-3 font-mono text-[11px] text-gray-400 space-y-1">
              {responseBodies[method].map((l, i) => (
                <div key={i} className={l.startsWith("//") ? "text-gray-600 italic" : l.includes('"') ? "text-green-400" : "text-gray-500"}>{l}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.restTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── DATABASE SECTION ─────────────────────────────────────────────────────────

const INITIAL_ROWS = [
  { id: 1, name: "Ali Valiyev",   email: "ali@example.com",  role: "admin" },
  { id: 2, name: "Vali Karimov",  email: "vali@example.com", role: "user" },
  { id: 3, name: "Zulfiya Usmon", email: "zulfiya@ex.com",   role: "user" },
  { id: 4, name: "Jasur Toshev",  email: "jasur@ex.com",     role: "mod" },
];

function DatabaseSection({ t }: { t: BackendTranslations }) {
  const [op, setOp] = useState<"SELECT"|"INSERT"|"UPDATE"|"DELETE">("SELECT");
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [newRow, setNewRow] = useState<typeof INITIAL_ROWS[0] | null>(null);
  const [affected, setAffected] = useState<number | null>(null);

  const codeLines: Record<string, string[]> = {
    SELECT: ["-- SELECT: Read all users", "SELECT id, name, email, role", "FROM users", "WHERE role = 'user'", "ORDER BY id ASC;"],
    INSERT: ["-- INSERT: Add new user", "INSERT INTO users (name, email, role)", "VALUES (", "  'Nodira Rahimova',", "  'nodira@ex.com',", "  'user'", ");"],
    UPDATE: ["-- UPDATE: Change role", "UPDATE users", "SET role = 'admin'", "WHERE id = 2;"],
    DELETE: ["-- DELETE: Remove user", "DELETE FROM users", "WHERE id = 4;"],
  };

  const runQuery = async () => {
    setHighlighted([]);
    setNewRow(null);
    setAffected(null);

    if (op === "SELECT") {
      setHighlighted([2, 3]);
      setAffected(2);
    } else if (op === "INSERT") {
      const next = { id: rows.length + 1, name: "Nodira Rahimova", email: "nodira@ex.com", role: "user" };
      await new Promise(r => setTimeout(r, 300));
      setNewRow(next);
      setRows(r => [...r, next]);
      setAffected(1);
    } else if (op === "UPDATE") {
      setHighlighted([2]);
      await new Promise(r => setTimeout(r, 400));
      setRows(r => r.map(row => row.id === 2 ? { ...row, role: "admin" } : row));
      setAffected(1);
    } else if (op === "DELETE") {
      setHighlighted([4]);
      await new Promise(r => setTimeout(r, 500));
      setRows(r => r.filter(row => row.id !== 4));
      setHighlighted([]);
      setAffected(1);
    }
  };

  const reset = () => { setRows(INITIAL_ROWS); setHighlighted([]); setNewRow(null); setAffected(null); };

  const opColors: Record<string, string> = {
    SELECT: "text-emerald-400", INSERT: "text-blue-400", UPDATE: "text-yellow-400", DELETE: "text-red-400",
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-gray-500 font-mono mb-3">SQL Operation</p>
          <div className="grid grid-cols-2 gap-2">
            {(["SELECT", "INSERT", "UPDATE", "DELETE"] as const).map(o => (
              <button key={o} onClick={() => { setOp(o); reset(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold font-mono border transition-all duration-150 ${
                  op === o
                    ? o === "SELECT" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : o === "INSERT" ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : o === "UPDATE" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                    : "bg-red-500/20 text-red-300 border-red-500/40"
                    : "bg-surface-2 text-gray-500 border-border"
                }`}>{o}
              </button>
            ))}
          </div>
        </div>

        <button onClick={runQuery}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Play size={14} />
          Run Query
        </button>
        <button onClick={reset} className="w-full py-2 rounded-xl border border-border text-gray-500 text-xs hover:text-gray-300 transition-colors">
          Reset table
        </button>

        <JSCode lines={codeLines[op]} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={op} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className={`font-bold font-mono ${opColors[op]}`}>{op}</code>{" — "}{t.dbExplain[op]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-[#0d1117] overflow-hidden flex-1">
          <div className="px-4 py-2 border-b border-border/50 bg-[#161b22] flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-mono">{t.dbTable}</span>
            {affected !== null && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`text-[10px] font-mono font-bold ${opColors[op]}`}>
                {affected} {t.dbRows}
              </motion.span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="border-b border-border/50">
                  {["id", "name", "email", "role"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {rows.map(row => (
                    <motion.tr key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1, x: 0,
                        backgroundColor: highlighted.includes(row.id)
                          ? op === "SELECT" ? "rgba(16,185,129,0.08)" : op === "UPDATE" ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)"
                          : "transparent",
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-border/30">
                      <td className="px-4 py-2.5 text-orange-400">{row.id}</td>
                      <td className="px-4 py-2.5 text-gray-300">{row.name}</td>
                      <td className="px-4 py-2.5 text-blue-400">{row.email}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.role === "admin" ? "bg-yellow-500/20 text-yellow-300" :
                          row.role === "mod"   ? "bg-blue-500/20 text-blue-300" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>{row.role}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.dbTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH (JWT) SECTION ───────────────────────────────────────────────────────

function AuthSection({ t }: { t: BackendTranslations }) {
  const [phase, setPhase] = useState<"idle"|"sign"|"send"|"verify">("idle");
  const [tokenState, setTokenState] = useState<"valid"|"invalid"|"expired"|null>(null);

  const TOKEN_PARTS = {
    header:    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    payload:   "eyJ1c2VySWQiOjEsIm5hbWUiOiJBbGkiLCJpYXQiOjE2MzQ5OTk5OTksImV4cCI6MTYzNTAwMzU5OX0",
    signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  };

  const codeLines = [
    "const jwt = require('jsonwebtoken');",
    "",
    "// 1. Sign token on login",
    "const token = jwt.sign(",
    "  { userId: 1, name: 'Ali' },",
    "  process.env.JWT_SECRET,",
    "  { expiresIn: '15m' }",
    ");",
    "",
    "// 2. Verify token on request",
    "const decoded = jwt.verify(",
    "  token,",
    "  process.env.JWT_SECRET",
    ");",
    "// decoded → { userId: 1, name: 'Ali', iat: ..., exp: ... }",
  ];

  const runPhase = async (p: "sign" | "send" | "verify") => {
    setPhase(p);
    setTokenState(null);
    if (p === "verify") {
      await new Promise(r => setTimeout(r, 800));
      setTokenState("valid");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {(["sign", "send", "verify"] as const).map((p, i) => (
            <button key={p} onClick={() => runPhase(p)}
              className={`w-full py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                phase === p
                  ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300"
                  : "bg-surface border-border text-gray-400 hover:border-gray-600"
              }`}>
              <span className="w-5 h-5 rounded-full bg-surface-2 border border-border text-[10px] flex items-center justify-center font-mono">{i + 1}</span>
              {p === "sign" ? `1. ${t.authLogin} → jwt.sign()` : p === "send" ? `2. Bearer Token →` : `3. jwt.verify() →`}
            </button>
          ))}
        </div>

        {tokenState && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border px-4 py-3 text-sm font-bold ${
              tokenState === "valid" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" :
              tokenState === "invalid" ? "border-red-500/40 bg-red-500/10 text-red-300" :
              "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
            }`}>
            {tokenState === "valid" ? t.authValid : tokenState === "invalid" ? t.authInvalid : t.authExpired}
          </motion.div>
        )}

        <JSCode lines={codeLines} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain */}
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              {phase === "idle" ? t.authSubtitle : t.authExplain[phase]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* JWT Token display */}
        <div className="rounded-2xl border border-border bg-[#0d1117] p-5 flex-1">
          <p className="text-[10px] text-gray-600 font-mono mb-3">{t.authToken}:</p>
          <div className="font-mono text-[11px] break-all leading-6 mb-4">
            <motion.span animate={{ opacity: phase === "idle" ? 0.3 : 1 }} className="text-red-400">{TOKEN_PARTS.header}</motion.span>
            <span className="text-gray-600">.</span>
            <motion.span animate={{ opacity: phase === "sign" || phase === "idle" ? 0.3 : 1 }} className="text-yellow-400">{TOKEN_PARTS.payload}</motion.span>
            <span className="text-gray-600">.</span>
            <motion.span animate={{ opacity: phase === "verify" ? 1 : 0.3 }} className="text-blue-400">{TOKEN_PARTS.signature}</motion.span>
          </div>

          <div className="flex gap-2 mb-4">
            {[
              { label: t.authHeader,    color: "bg-red-500/20 text-red-300 border-red-500/30" },
              { label: t.authPayload,   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
              { label: t.authSignature, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
            ].map(part => (
              <div key={part.label} className={`px-2 py-1 rounded border text-[10px] font-mono ${part.color}`}>{part.label}</div>
            ))}
          </div>

          {/* Decoded payload */}
          {(phase === "send" || phase === "verify") && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-[10px] text-gray-500 font-mono mb-2">{t.authPayload} (decoded):</p>
              <div className="font-mono text-[11px] space-y-0.5">
                <div><span className="text-yellow-300">userId</span><span className="text-gray-500">: </span><span className="text-orange-400">1</span></div>
                <div><span className="text-yellow-300">name</span><span className="text-gray-500">: </span><span className="text-green-400">"Ali"</span></div>
                <div><span className="text-yellow-300">iat</span><span className="text-gray-500">: </span><span className="text-orange-400">1634999999</span></div>
                <div><span className="text-yellow-300">exp</span><span className="text-gray-500">: </span><span className="text-orange-400">1635000899</span><span className="text-gray-600"> // +15min</span></div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.authTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── MIDDLEWARE SECTION ───────────────────────────────────────────────────────

const MW_STEPS = [
  { id: "logger",    label: "Logger",     icon: "📝", color: "blue" },
  { id: "auth",      label: "Auth",       icon: "🔐", color: "yellow" },
  { id: "ratelimit", label: "Rate Limit", icon: "⏱️", color: "orange" },
  { id: "handler",   label: "Handler",   icon: "⚡", color: "emerald" },
];

function MiddlewareSection({ t }: { t: BackendTranslations }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [blockAt, setBlockAt] = useState<"auth" | "ratelimit" | null>(null);
  const [running, setRunning] = useState(false);

  const codeLines = [
    "const app = express();",
    "",
    "// Middleware chain",
    "app.use(loggerMiddleware);",
    "app.use(authMiddleware);",
    "app.use(rateLimitMiddleware);",
    "",
    "// Route handler",
    "app.get('/api/data', (req, res) => {",
    "  res.json({ data: 'Protected data!' });",
    "});",
  ];

  const run = async (stopAt?: "auth" | "ratelimit") => {
    setRunning(true);
    setActiveStep(-1);
    setBlocked(null);
    setBlockAt(stopAt || null);

    for (let i = 0; i < MW_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 600));
      if (stopAt && MW_STEPS[i].id === stopAt) {
        setBlocked(stopAt);
        setRunning(false);
        return;
      }
    }
    setRunning(false);
  };

  const colorMap: Record<string, string> = {
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    yellow: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <button onClick={() => run()} disabled={running}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Play size={14} />Request passes through
          </button>
          <button onClick={() => run("auth")} disabled={running}
            className="w-full py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-50 font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Shield size={14} />Blocked at Auth (401)
          </button>
          <button onClick={() => run("ratelimit")} disabled={running}
            className="w-full py-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 disabled:opacity-50 font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Zap size={14} />Blocked at Rate Limit (429)
          </button>
        </div>
        <JSCode lines={codeLines} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Flow */}
        <div className="rounded-2xl border border-border bg-[#0d1117] p-6 flex-1">
          {/* Incoming request */}
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-mono font-bold">
              {t.mwRequest}
            </div>
            <ChevronRight size={14} className="text-gray-600" />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {MW_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              const isPassed = activeStep > i && blocked !== step.id;
              const isBlocked = blocked === step.id;
              return (
                <motion.div key={step.id}
                  animate={{
                    borderColor: isBlocked ? "rgba(239,68,68,0.5)" : isActive ? "rgba(255,255,255,0.2)" : isPassed ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)",
                  }}
                  className="rounded-xl border bg-surface p-3 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all duration-300 ${
                    isBlocked ? "border-red-500/40 bg-red-500/10" :
                    isPassed  ? "border-emerald-500/40 bg-emerald-500/10" :
                    isActive  ? colorMap[step.color] :
                    "border-border bg-surface-2"
                  }`}>{step.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-200">{step.label}</span>
                      {isActive && !isBlocked && <motion.div animate={{ opacity: [0.5,1,0.5] }} transition={{ duration:0.8, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.mwExplain[step.id]}</p>
                  </div>
                  <div className="text-sm">
                    {isBlocked ? <span className="text-red-400 font-mono text-xs font-bold">{t.mwBlocked}</span> :
                     isPassed  ? <span className="text-emerald-400">✓</span> :
                     isActive  ? <span className="text-white font-mono text-[10px]">{t.mwNext}</span> : null}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Response */}
          {activeStep === 3 && !blocked && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3">
              <ChevronRight size={14} className="text-gray-600" />
              <div className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold">
                {t.mwResponse} — 200 OK
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.mwTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── WEBSOCKET SECTION ────────────────────────────────────────────────────────

interface WSMessage { from: "client" | "server"; text: string; time: string; }

function WebSocketSection({ t }: { t: BackendTranslations }) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const codeLines = [
    "// Server (Node.js + ws)",
    "const WebSocket = require('ws');",
    "const wss = new WebSocket.Server({ port: 8080 });",
    "",
    "wss.on('connection', (ws) => {",
    "  ws.send('Hello from server!');",
    "",
    "  ws.on('message', (msg) => {",
    "    // Broadcast to all clients",
    "    wss.clients.forEach(c => c.send(msg));",
    "  });",
    "});",
  ];

  const now = () => new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const connect = () => {
    setConnected(true);
    setMessages([{ from: "server", text: "✅ WebSocket connected!", time: now() },
                 { from: "server", text: "👋 Hello from server!", time: now() }]);
  };

  const disconnect = () => {
    setConnected(false);
    setMessages(m => [...m, { from: "server", text: "🔌 Connection closed.", time: now() }]);
  };

  const sendMsg = () => {
    if (!input.trim() || !connected) return;
    const msg = input.trim();
    setInput("");
    setMessages(m => [...m, { from: "client", text: msg, time: now() }]);
    setTimeout(() => {
      setMessages(m => [...m, { from: "server", text: `Echo: ${msg}`, time: now() }]);
    }, 300);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
            <span className={`text-sm font-mono font-bold ${connected ? "text-emerald-400" : "text-gray-500"}`}>
              {connected ? t.wsConnected : t.wsDisconnected}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={connect} disabled={connected}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all">
              {t.wsConnect}
            </button>
            <button onClick={disconnect} disabled={!connected}
              className="flex-1 py-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-40 text-xs font-bold transition-all">
              {t.wsDisconnect}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 px-4 py-3">
          <p className="text-xs text-gray-400 leading-relaxed">{t.wsExplain}</p>
        </div>

        <JSCode lines={codeLines} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Chat panels */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {/* Client panel */}
          <div className="rounded-2xl border border-blue-500/20 bg-[#0d1117] overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border/50 bg-[#161b22] flex items-center gap-2">
              <Monitor size={12} className="text-blue-400" />
              <span className="text-[10px] font-mono text-gray-500">{t.wsClient}</span>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto max-h-48">
              {messages.filter(m => m.from === "client").map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-blue-500/15 border border-blue-500/20 rounded-lg px-3 py-1.5">
                  <div className="text-xs text-blue-300">{m.text}</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">{m.time}</div>
                </motion.div>
              ))}
            </div>
            <div className="p-2 border-t border-border/50 flex gap-1">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                disabled={!connected}
                className="flex-1 bg-surface-2 border border-border rounded-lg px-2 py-1 text-xs text-gray-300 placeholder-gray-600 disabled:opacity-40"
                placeholder={connected ? "Type a message..." : "Connect first"} />
              <button onClick={sendMsg} disabled={!connected || !input.trim()}
                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs transition-all">
                {t.wsSend}
              </button>
            </div>
          </div>

          {/* Server panel */}
          <div className="rounded-2xl border border-pink-500/20 bg-[#0d1117] overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border/50 bg-[#161b22] flex items-center gap-2">
              <Server size={12} className="text-pink-400" />
              <span className="text-[10px] font-mono text-gray-500">{t.wsServer}</span>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto max-h-48">
              {messages.filter(m => m.from === "server").map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-pink-500/15 border border-pink-500/20 rounded-lg px-3 py-1.5">
                  <div className="text-xs text-pink-300">{m.text}</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">{m.time}</div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.wsTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── CORS SECTION ─────────────────────────────────────────────────────────────

function CORSSection({ t }: { t: BackendTranslations }) {
  const [scenario, setScenario] = useState<"same"|"allowed"|"blocked"|"options">("same");

  const scenarios = [
    { id: "same",    label: "Same Origin",   icon: "🟢", from: "https://myapp.com", to: "https://myapp.com/api" },
    { id: "allowed", label: "CORS Allowed",  icon: "✅", from: "https://frontend.com", to: "https://api.com/data" },
    { id: "blocked", label: "CORS Blocked",  icon: "❌", from: "https://evil.com", to: "https://api.com/data" },
    { id: "options", label: "Preflight",     icon: "🔄", from: "https://frontend.com", to: "OPTIONS https://api.com" },
  ] as const;

  const isAllowed = scenario === "same" || scenario === "allowed" || scenario === "options";

  const codeLines = [
    "const cors = require('cors');",
    "",
    "// Allow specific origins",
    "app.use(cors({",
    "  origin: ['https://frontend.com',",
    "           'https://app.mysite.com'],",
    "  methods: ['GET', 'POST', 'PUT', 'DELETE'],",
    "  allowedHeaders: ['Content-Type', 'Authorization'],",
    "}));",
    "",
    "// Response headers added:",
    "// Access-Control-Allow-Origin: https://frontend.com",
    "// Access-Control-Allow-Methods: GET, POST, PUT, DELETE",
  ];

  const sc = scenarios.find(s => s.id === scenario)!;

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-gray-500 font-mono mb-3">Scenario</p>
          <div className="flex flex-col gap-2">
            {scenarios.map(s => (
              <button key={s.id} onClick={() => setScenario(s.id)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-bold text-left flex items-center gap-2 transition-all ${
                  scenario === s.id
                    ? s.id === "blocked" ? "border-red-500/40 bg-red-500/10 text-red-300"
                    : s.id === "options" ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-border bg-surface-2 text-gray-400"
                }`}>
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
        <JSCode lines={codeLines} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain */}
        <AnimatePresence mode="wait">
          <motion.div key={scenario} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-xl border px-4 py-3 ${
              isAllowed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
            }`}>
            <p className="text-sm text-gray-300">{t.corsExplain[scenario]}</p>
          </motion.div>
        </AnimatePresence>

        {/* Diagram */}
        <div className="rounded-2xl border border-border bg-[#0d1117] p-6 flex-1">
          <div className="flex flex-col gap-6">
            {/* Browser → API */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Monitor size={20} className="text-blue-400" />
                </div>
                <span className="text-[9px] text-gray-600 font-mono">{sc.from}</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-sm ${scenario === "options" ? "text-blue-400" : "text-gray-300"}`}>
                  {scenario === "options" ? "OPTIONS →" : `${scenario === "blocked" ? "GET" : "GET"} →`}
                </motion.div>
                <div className="w-full h-px bg-gradient-to-r from-blue-500/40 via-gray-600/40 to-transparent" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                  isAllowed ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"
                }`}>
                  <Server size={20} className={isAllowed ? "text-emerald-400" : "text-red-400"} />
                </div>
                <span className="text-[9px] text-gray-600 font-mono">{sc.to}</span>
              </div>
            </div>

            {/* Response headers */}
            <div className={`rounded-xl border p-4 ${
              isAllowed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
            }`}>
              <p className="text-[10px] text-gray-500 font-mono mb-2">Response Headers:</p>
              <div className="font-mono text-[11px] space-y-1">
                {isAllowed ? (
                  <>
                    <div><span className="text-yellow-300">Access-Control-Allow-Origin</span><span className="text-gray-500">: </span><span className="text-green-400">{scenario === "allowed" ? "https://frontend.com" : "*"}</span></div>
                    {scenario === "options" && (
                      <>
                        <div><span className="text-yellow-300">Access-Control-Allow-Methods</span><span className="text-gray-500">: </span><span className="text-green-400">GET, POST, PUT, DELETE</span></div>
                        <div><span className="text-yellow-300">Access-Control-Max-Age</span><span className="text-gray-500">: </span><span className="text-orange-400">86400</span></div>
                      </>
                    )}
                    <div><span className="text-yellow-300">Content-Type</span><span className="text-gray-500">: </span><span className="text-green-400">application/json</span></div>
                  </>
                ) : (
                  <div className="text-red-400">// CORS headers missing → Browser blocks response</div>
                )}
              </div>
            </div>

            {/* Result */}
            <motion.div key={scenario}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl border px-4 py-3 text-center font-bold text-sm ${
                isAllowed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}>
              {isAllowed ? t.corsAllowed : t.corsBlocked}
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {t.corsTips.map((tip: any) => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BackendPage() {
  const { lang } = useLangStore();
  const t = BACKEND_I18N[lang as "uz" | "en" | "ru"] ?? BACKEND_I18N.en;
  const [activeTab, setActiveTab] = useState<TabId>("http");

  const activeTabCfg = TABS.find(tb => tb.id === activeTab)!;

  const renderSection = () => {
    switch (activeTab) {
      case "http":       return <HTTPSection t={t as any} />;
      case "rest":       return <RESTSection t={t} />;
      case "database":   return <DatabaseSection t={t} />;
      case "auth":       return <AuthSection t={t} />;
      case "middleware": return <MiddlewareSection t={t} />;
      case "websocket":  return <WebSocketSection t={t} />;
      case "cors":       return <CORSSection t={t} />;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(to right,#3b82f6 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="z-10 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors">
              <ArrowLeft size={14} />
              <span className="hidden sm:block">LogicLab</span>
            </Link>
            <span className="text-gray-700">/</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Server size={12} className="text-white" />
              </div>
              <span className="font-bold text-sm text-white">{t.pageTitle}</span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-4">
            <Zap size={11} />
            Backend Visualizer
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t.pageTitle}</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">{t.pageSubtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                activeTab === tab.id
                  ? `${tab.color} ${tab.border} bg-white/5 ${tab.glow}`
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-surface-2"
              }`}>
              {tab.icon}
              {t.tabs[tab.id]}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
