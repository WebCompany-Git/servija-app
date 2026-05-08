"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
// Cria o cliente Supabase para uso no browser (componentes cliente)
// Usado em páginas com 'use client' — login, formulários, chat, etc.
var ssr_1 = require("@supabase/ssr");
function createClient() {
    return (0, ssr_1.createBrowserClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, // URL do teu projecto Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Chave pública do Supabase
    );
}
exports.createClient = createClient;
