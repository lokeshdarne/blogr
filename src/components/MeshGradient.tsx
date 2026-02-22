export default function MeshGradient() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Primary mesh gradient - top right */}
            <div
                className="mesh-gradient absolute -top-1/4 -right-1/4 w-1/2 h-1/2 opacity-[0.03]"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 80% 60% at 50% 50%,
                            rgba(161, 161, 170, 0.4) 0%,
                            rgba(100, 116, 139, 0.2) 40%,
                            transparent 70%
                        )
                    `,
                }}
            />

            {/* Secondary mesh gradient - bottom left */}
            <div
                className="mesh-gradient absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 opacity-[0.02]"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 60% 80% at 50% 50%,
                            rgba(148, 163, 184, 0.3) 0%,
                            rgba(100, 116, 139, 0.15) 40%,
                            transparent 70%
                        )
                    `,
                    animationDelay: '-10s',
                }}
            />

            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 80% 80% at 50% 50%,
                            transparent 0%,
                            rgba(3, 3, 3, 0.5) 100%
                        )
                    `,
                }}
            />
        </div>
    );
}
