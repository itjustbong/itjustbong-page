"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { awards, articles, patents } from "@/lib/resume-data";
import { Trophy, Newspaper, ScrollText } from "lucide-react";

export function AwardsSection() {
  // Group awards by year
  const awardsByYear = awards.reduce(
    (acc, award) => {
      if (!acc[award.year]) {
        acc[award.year] = [];
      }
      acc[award.year].push(award.title);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const sortedYears = Object.keys(awardsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="mb-12" id="awards">
      <SectionHeader title="Awards" icon={<Trophy className="w-5 h-5" />} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {sortedYears.map((year) => (
          <div
            key={year}
            className="p-4 rounded-lg bg-card border border-border"
          >
            <span className="text-accent font-mono text-sm font-semibold">
              {year}
            </span>
            <ul className="mt-2 space-y-1">
              {awardsByYear[year].map((title, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SectionHeader title="Articles & Media" icon={<Newspaper className="w-5 h-5" />} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <span className="text-xs text-muted-foreground font-mono whitespace-nowrap mt-0.5">
                  {article.date}
                </span>
                <span className="text-sm text-foreground leading-relaxed">
                  {article.title}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <div>
          <SectionHeader title="Patents" icon={<ScrollText className="w-5 h-5" />} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {patents.map((patent, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <span className="text-sm text-foreground leading-relaxed">
                  {patent.title}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
