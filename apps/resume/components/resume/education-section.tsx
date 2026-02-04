"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { education, communities } from "@/lib/resume-data";
import { HighlightText } from "@/lib/highlight-text";
import { GraduationCap, Users } from "lucide-react";

export function EducationSection() {
  return (
    <section className="mb-12" id="education">
      <SectionHeader title="Education" icon={<GraduationCap className="w-5 h-5" />} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-lg bg-card border border-border mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground">
            {education.school}
          </h3>
          <span className="text-sm text-muted-foreground font-mono">
            {education.period}
          </span>
        </div>
        <p className="text-muted-foreground">{education.major}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          {education.gpa && (
            <span className="text-accent">GPA: {education.gpa}</span>
          )}
          {education.note && (
            <span className="text-muted-foreground">{education.note}</span>
          )}
        </div>
      </motion.div>

      <SectionHeader title="Community" icon={<Users className="w-5 h-5" />} />
      <div className="space-y-4">
        {communities.map((community, index) => (
          <motion.div
            key={community.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-5 rounded-lg bg-card border border-border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground">{community.name}</h3>
              <span className="text-xs text-muted-foreground font-mono">
                {community.period}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              <HighlightText text={community.description} />
            </p>
            <ul className="space-y-1">
              {community.activities.map((activity, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-accent/50"
                >
                  <HighlightText text={activity} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
