"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  artifactTitle: string;
  glbUrl?: string;
  usdzUrl?: string;
}

export function ARViewer({
  isOpen,
  onClose,
  artifactTitle,
  glbUrl = "/models/specimen.glb",
  usdzUrl = "/models/specimen.usdz",
}: ARViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleLaunchMobileAR = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // Apple QuickLook trigger
      const anchor = document.createElement("a");
      anchor.setAttribute("rel", "ar");
      anchor.setAttribute("href", usdzUrl);
      anchor.appendChild(document.createElement("img"));
      anchor.click();
    } else if (isAndroid) {
      // Google SceneViewer intent
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        glbUrl
      )}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      window.location.href = intentUrl;
    } else {
      // Desktop: copy AR link to view on mobile
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="WEBXR SPATIAL PROJECTION">
      <div className="space-y-6 pt-2">
        <div className="rounded border border-border bg-secondary/30 p-4 text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
            1:1 PHYSICAL SCALE PREVIEW
          </span>
          <h4 className="font-serif text-sm text-foreground">{artifactTitle}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Project this artifact into your physical environment using WebXR spatial anchors or
            Apple QuickLook.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleLaunchMobileAR} className="w-full">
            {copied ? "COPIED URL FOR MOBILE" : "PROJECT IN AUGMENTED REALITY"}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            RETURN TO ATELIER
          </Button>
        </div>

        <div className="border-t border-border pt-4 text-center">
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
            Compatible with WebXR (Chrome/Android) & Apple AR QuickLook (iOS Safari)
          </p>
        </div>
      </div>
    </Modal>
  );
}
