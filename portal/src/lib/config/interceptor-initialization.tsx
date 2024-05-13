"use client";

import { useEffect } from "react";

import setup from "@/lib/config/axios-interceptor";
export default function InterceptorInitialization() {
    useEffect(() => setup(), []);
    return null;
}
