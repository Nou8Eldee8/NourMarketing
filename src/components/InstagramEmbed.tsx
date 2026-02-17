"use client";

import { useEffect, useRef } from 'react';

export default function InstagramEmbed({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Determine if the script is already loaded
        if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
        } else {
            const script = document.createElement('script');
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            script.onload = () => {
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process();
                }
            };
            document.body.appendChild(script);
        }
    }, [url]);

    return (
        <div className="instagram-embed-container w-full h-full flex justify-center items-center overflow-hidden bg-transparent rounded-lg">
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                    background: "transparent",
                    border: 0,
                    borderRadius: "3px",
                    boxShadow: "none",
                    margin: "1px",
                    maxWidth: "540px",
                    minWidth: "326px",
                    padding: 0,
                    width: "calc(100% - 2px)",
                }}
            >
            </blockquote>
        </div>
    );
}
