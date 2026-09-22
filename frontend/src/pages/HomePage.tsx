import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Compass, CheckCircle, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-12">
      {/* Editorial Hero Section */}
      <section className="pt-4 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Main Headline Column (7 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400" />
              <span>Vol. 01 — Engineering Portfolio &amp; Roadmap Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08]"
            >
              Architect Systems. <br />
              <span className="italic font-normal text-amber-700 dark:text-amber-400">
                Curate Engineering Depth.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed"
            >
              SkillHub provides engineers with a disciplined workspace to document production-grade
              codebases, track milestone-driven roadmaps, and present verified technical mastery.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition shadow-sm"
              >
                <span>Browse Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/paths"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border bg-card hover:bg-secondary text-foreground font-mono text-xs uppercase tracking-wider font-medium transition"
              >
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Explore Curriculums</span>
              </Link>

              <a
                href="https://github.com/Divyanshu-Off/SkillHub"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-sm text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Architectural Manifest / Stat Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-border space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block">
                [Specification Note]
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Technical Architecture
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SkillHub decouples state management, API querying, and security protocols into an
                integrated full-stack delivery framework.
              </p>
            </div>

            <div className="divide-y divide-border border-y border-border py-1 text-xs font-mono">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium text-foreground">Django 5 + REST</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="font-medium text-foreground">PostgreSQL 16</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Frontend Client</span>
                <span className="font-medium text-foreground">React 19 + Vite</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className="font-medium text-foreground">SimpleJWT Bearer</span>
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-sm border border-border/80 text-[11px] text-muted-foreground space-y-1">
              <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Automated Verification
              </span>
              <p>Continuous Integration with Pytest and TypeScript build sanity checks.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Row — Hairline Borders */}
      <section className="hairline-y border-y border-border py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { label: '01 / ARCHITECTURE', title: 'Decoupled REST', desc: 'Django Rest Framework endpoints' },
            { label: '02 / PERSISTENCE', title: 'Relational Schema', desc: 'PostgreSQL normalized models' },
            { label: '03 / AUTHENTICATION', title: 'Stateless Tokens', desc: 'JWT refresh & access lifecycle' },
            { label: '04 / PIPELINE', title: 'Automated CI/CD', desc: 'Continuous testing & quality gate' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block">
                {item.label}
              </span>
              <p className="font-serif text-base font-bold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Engineering Disciplines — Asymmetric Editorial Grid */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-1">
              Engineered for Depth and Verification
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Index / 01–03</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Large Featured Showcase (7 cols) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-7 editorial-card p-8 sm:p-10 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">[01] SHOWCASE</span>
                <span>DRF ViewSets + Permissions</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Technical Project Portfolio
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Curate end-to-end engineering works with structured metadata, source repository
                references, live deployment URLs, and authenticated author ownership.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-secondary/40 rounded-sm border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">METHOD</span>
                  <span className="font-semibold text-foreground">GET / POST</span>
                </div>
                <div className="p-2.5 bg-secondary/40 rounded-sm border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">PERMISSIONS</span>
                  <span className="font-semibold text-foreground">IsOwnerOrReadOnly</span>
                </div>
                <div className="p-2.5 bg-secondary/40 rounded-sm border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">CACHE / STATE</span>
                  <span className="font-semibold text-foreground">React Query</span>
                </div>
              </div>

              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground font-semibold hover:underline"
              >
                <span>View Projects Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Stacked Cards 2 & 3 (5 cols) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            {/* Card 2: Learning Curriculums */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="editorial-card p-7 space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">[02] CURRICULUMS</span>
                <Compass className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Milestone-Driven Curriculums
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Break complex domains into chronological milestones. Track completion percentages
                computed dynamically via relational queries.
              </p>
              <div className="pt-2">
                <Link
                  to="/paths"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground font-semibold hover:underline"
                >
                  <span>Explore Learning Paths</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Security & Testing */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="editorial-card p-7 space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">[03] INTEGRITY</span>
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Verified Code Quality &amp; Security
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SimpleJWT authentication headers attached to protected mutations. Automated CI runs
                Django test suites on every pull request.
              </p>
              <div className="pt-2">
                <a
                  href="https://github.com/Divyanshu-Off/SkillHub/actions"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground font-semibold hover:underline"
                >
                  <span>Inspect GitHub Workflows</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
