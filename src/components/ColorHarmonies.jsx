import React, { useMemo } from 'react';
import ColorDisplayRow from './ColorDisplayRow.jsx';

const ColorHarmonies = ({ colorObj }) => {
    const harmonies = useMemo(() => {
        if (!colorObj) return {};
        try {
            return {
                complementary: [colorObj.clone().set("oklch.h", h => h + 180)],
                triadic: [
                    colorObj,
                    colorObj.clone().set("oklch.h", h => h + 120),
                    colorObj.clone().set("oklch.h", h => h - 120),
                ],
                tetradic: [
                    colorObj,
                    colorObj.clone().set("oklch.h", h => h + 90),
                    colorObj.clone().set("oklch.h", h => h + 180),
                    colorObj.clone().set("oklch.h", h => h + 270),
                ],
            };
        } catch (e) {
            console.error("Error creating harmonies:", e);
            return {};
        }
    }, [colorObj]);

    if (!colorObj || !harmonies.triadic) return null;

    return (
        <div className="space-y-4">
            <details>
                <summary className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Complementary
                </summary>
                <div className="mt-3">
                    {harmonies.complementary?.map((c, i) => <ColorDisplayRow key={i} title="Complement" colorObj={c} />)}
                </div>
            </details>

            <details>
                <summary className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Triadic Harmony
                </summary>
                <div className="space-y-2 mt-3">
                    {harmonies.triadic?.map((c, i) => <ColorDisplayRow key={i} title={i === 0 ? 'Base' : `Triad ${i + 1}`} colorObj={c} />)}
                </div>
            </details>

            <details>
                <summary className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Tetradic Harmony
                </summary>
                <div className="space-y-2 mt-3">
                    {harmonies.tetradic?.map((c, i) => <ColorDisplayRow key={i} title={i === 0 ? 'Base' : `Tetrad ${i + 1}`} colorObj={c} />)}
                </div>
            </details>
        </div>
    );
};

export default ColorHarmonies;
