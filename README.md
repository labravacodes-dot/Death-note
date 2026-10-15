Death Note: Human World Ledger

An interactive, web-based application simulating the canonical Death Note ledger. Built with vanilla web standards, this project demonstrates real-time state management, dynamic DOM manipulation, asynchronous timer execution, and custom UI/UX design.

I have always dreamed of holding a real Death Note, and using what I learned from The Odin Project, I brought the Death Note to life itself. This has been a lifelong dream of mine—pouring my love, devotion, and technical skill into making it a reality so I could see and feel the Death Note alive.

Please consider this project under the category of fanart, which it is. Death Note is a classic anime and manga created by Tsugumi Ohba and Takeshi Obata. The background music belongs to its respective creators, and I do not claim ownership of it; this project exists purely as a testament to my dedication and love for the series.
Technical Features

    Stateful Ownership Binding: Dynamically captures and binds user identity across application states.

    Asynchronous Execution Engine: Utilizes JavaScript intervals to drive a real-time 40-second countdown system.

    Dynamic DOM Expansion: Programmatically appends archival pages in response to entry scaling.

    Shinigami Companion Overlay: SVG vector elements combined with dynamic inactivity detection.

    Web Audio Management: Integrated audio controls supporting automatic playback triggers upon user interaction.

Stack & Architecture

    Markup: HTML5

    Styling: CSS3 (Custom Properties, Flexbox, CSS Grid)

    Scripting: Vanilla JavaScript (ES6+, DOM Manipulation, Event Listeners)

    Fonts: Google Fonts (Cinzel, Courier Prime)

Code Highlight
JavaScript

// Asynchronous countdown loop enforcing the 40-second rule
setInterval(() => {
    let updated = false;
    entries.forEach(entry => {
        if (entry.status === 'active' && entry.timer > 0) {
            entry.timer--;
            if (entry.timer === 0) {
                entry.status = 'expired';
            }
            updated = true;
        }
    });
    if (updated && currentPage >= 17) {
        renderLedger();
    }
}, 1000);