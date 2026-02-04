"use client";

import React from "react"

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-6"
    >
      {icon && (
        <span className="text-accent text-xl">{icon}</span>
      )}
      <h2 className="text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h2>
      <div className="flex-1 h-px bg-border ml-4" />
    </motion.div>
  );
}
