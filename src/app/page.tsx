"use client";

import { useState } from "react";
import Boot from "@/components/Boot";
import { SmoothScroll } from "@/components/SmoothScroll";
import CursorBubble from "@/components/CursorBubble";
import TrailLayer from "@/components/TrailLayer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import Arsenal from "@/components/Arsenal";
import Experience from "@/components/Experience";
import { Contact } from "@/components/Contact";

export default function Home() {
  const [bootDone, setBootDone] = useState(false);

  if (!bootDone) {
    return <Boot onDone={() => setBootDone(true)} />;
  }

  return (
    <SmoothScroll>
      <CursorBubble />
      <TrailLayer />
      <Header />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <Arsenal />
        <Experience />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
