'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import './how-it-works.css';

/**
 * Sticky-pin scrollytelling: left column of scenes scrolls naturally; the
 * right panel stays pinned and crossfades a visual per active scene.
 * Native scroll only - an IntersectionObserver watching the viewport's
 * vertical middle band decides the active scene. On mobile the panel unpins
 * and each scene shows its visual inline. Reduced motion disables the
 * crossfade but keeps scene tracking so panel and text always match.
 */

const WAREHOUSES = ['Snowflake', 'Databricks', 'BigQuery', 'Postgres', 'Redshift', 'SQL Server'];

const SCENES = [
  {
    tag: 'No migration project',
    title: 'Connect what you already have',
    body: 'xFalcon maps the warehouse in place, checks the model, and learns your definitions. Your data stays where it is.',
  },
  {
    tag: 'No SQL required',
    title: 'Ask the real question',
    body: 'Use plain English. Follow any answer back to the tables, rules, and rows behind it.',
  },
  {
    tag: 'Every answer checked',
    title: 'It checks before it answers',
    body: 'Every result is tested against live warehouse data. Memory, annotations, and self-correction carry what your team learns forward.',
  },
  {
    tag: 'Ready before the meeting',
    title: 'Put the answer to work',
    body: 'The same governed logic powers daily briefs, QBR decks, and board-ready Excel and PowerPoint files.',
  },
];

function VizConnect() {
  return (
    <div className="hiw-viz-body">
      <div className="hiw-schema">
        <div className="hiw-schema-node hiw-schema-node-core">your warehouse</div>
        <div className="hiw-schema-links" aria-hidden="true">
          <span className="hiw-schema-link" />
          <span className="hiw-schema-link" />
          <span className="hiw-schema-link" />
        </div>
        <div className="hiw-schema-row">
          <div className="hiw-schema-node">SALES</div>
          <div className="hiw-schema-node">CUSTOMERS</div>
          <div className="hiw-schema-node">INVENTORY</div>
        </div>
      </div>
      <div className="hiw-chip-row">
        {WAREHOUSES.map((w) => (
          <span key={w} className="chip">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function VizAsk() {
  return (
    <div className="hiw-viz-body">
      <div className="hiw-chat-question">Why did northeast margin drop in June?</div>
      <div className="hiw-chat-answer">
        <p className="hiw-chat-answer-lead">
          Margin fell 3.2 points - freight surcharges on two distributors drove 80% of the change.
        </p>
        <div className="hiw-drill">
          <span className="hiw-drill-row">ORDERS · 1,284 rows</span>
          <span className="hiw-drill-row">FREIGHT_COSTS · rule: net of returns</span>
          <span className="hiw-drill-row">DISTRIBUTOR_MASTER · 2 flagged</span>
        </div>
      </div>
    </div>
  );
}

function VizCheck() {
  return (
    <div className="hiw-viz-body">
      <ul className="hiw-checklist" role="list">
        <li className="hiw-check hiw-check-pass">Result validated against live data</li>
        <li className="hiw-check hiw-check-pass">Memory applied: revenue excludes cancelled orders</li>
        <li className="hiw-check hiw-check-warn">Annotation: Q3 has a known 2-day gap - flagged</li>
        <li className="hiw-check hiw-check-pass">Aggregation guard: totals computed server-side</li>
      </ul>
      <p className="hiw-systems caption">Memory · Annotations · Self-Correction</p>
    </div>
  );
}

function VizDeliver() {
  return (
    <div className="hiw-viz-body">
      <div className="hiw-bars" aria-hidden="true">
        <span className="hiw-bar" />
        <span className="hiw-bar hiw-bar-2" />
        <span className="hiw-bar hiw-bar-3" />
        <span className="hiw-bar hiw-bar-accent" />
      </div>
      <div className="hiw-sowhat">
        <span className="hiw-sowhat-label">So what</span>
        <p className="hiw-sowhat-text">
          Renegotiate the two freight contracts before Q4 - recovers an estimated 2.4 margin points.
        </p>
      </div>
      <div className="hiw-outputs">
        <span className="chip">Daily brief</span>
        <span className="chip">QBR deck</span>
        <span className="chip">Board-ready Excel</span>
      </div>
    </div>
  );
}

const VIZZES = [VizConnect, VizAsk, VizCheck, VizDeliver];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sceneRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActive(index);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const node of sceneRefs.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToScene = (index: number) => {
    sceneRefs.current[index]?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section className={`section hiw${reduced ? ' hiw-reduced' : ''}`} id="how-it-works">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">How xFalcon works</p>
          <h2 className="heading-2">From live data to a decision you can defend</h2>
        </div>

        <div className="hiw-layout">
          <div className="hiw-scenes">
            {SCENES.map((scene, i) => {
              const Viz = VIZZES[i];
              return (
                <div
                  key={scene.title}
                  ref={(node) => {
                    sceneRefs.current[i] = node;
                  }}
                  className={`hiw-scene${active === i ? ' hiw-scene-active' : ''}`}
                >
                  <span className="hiw-scene-step">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="heading-3 hiw-scene-title">{scene.title}</h3>
                  <p className="body-copy hiw-scene-body">{scene.body}</p>
                  <span className="chip hiw-scene-tag">{scene.tag}</span>
                  <div className="hiw-mobile-viz">
                    <div className="hiw-panel">
                      <div className="hiw-panel-chrome" aria-hidden="true">
                        <span className="hiw-dot" />
                        <span className="hiw-dot" />
                        <span className="hiw-dot" />
                        <span className="hiw-url">xfalcon.ai</span>
                      </div>
                      <Viz />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hiw-stickywrap">
            <div className="hiw-sticky">
              <div className="hiw-panel">
                <div className="hiw-panel-chrome" aria-hidden="true">
                  <span className="hiw-dot" />
                  <span className="hiw-dot" />
                  <span className="hiw-dot" />
                  <span className="hiw-url">xfalcon.ai</span>
                </div>
                <div className="hiw-viz-stack">
                  {VIZZES.map((Viz, i) => (
                    <div
                      key={SCENES[i].title}
                      className={`hiw-viz${active === i ? ' hiw-viz-active' : ''}`}
                      aria-hidden={active !== i}
                    >
                      <Viz />
                    </div>
                  ))}
                </div>
                <p className="hiw-live-label" aria-live="polite">
                  Step {active + 1} of {SCENES.length}: {SCENES[active].title}
                </p>
              </div>
              <div className="hiw-dots">
                {SCENES.map((scene, i) => (
                  <button
                    key={scene.title}
                    type="button"
                    className={`hiw-dot-btn${active === i ? ' hiw-dot-btn-active' : ''}`}
                    aria-label={`Go to step ${i + 1}: ${scene.title}`}
                    aria-current={active === i ? 'step' : undefined}
                    onClick={() => scrollToScene(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
