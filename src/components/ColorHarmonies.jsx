import React, { useMemo } from 'react';
import ColorDisplayRow from './ColorDisplayRow.jsx';

const ColorHarmonies = ({ colorObj, gamutMode = 'space' }) => {
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
        <section aria-labelledby="color-harmonies-heading" className="space-y-4">
            <h2 id="color-harmonies-heading" className="text-lg font-bold text-gray-900 dark:text-white">
                Color Harmonies
            </h2>
            <details>
                <summary className="cursor-pointer transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-blue-400 dark:focus-visible:outline-blue-400">
                    <h3 className="inline text-base font-semibold text-gray-900 dark:text-white">
                        Complementary
                    </h3>
                </summary>
                <div className="mt-3">
                    {harmonies.complementary?.map((c, i) => <ColorDisplayRow key={i} titleAs="h4" title="Complement" colorObj={c} gamutMode={gamutMode} />)}
                </div>
            </details>

            <details>
                <summary className="cursor-pointer transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-blue-400 dark:focus-visible:outline-blue-400">
                    <h3 className="inline text-base font-semibold text-gray-900 dark:text-white">
                        Triadic Harmony
                    </h3>
                </summary>
                <div className="space-y-2 mt-3">
                    {harmonies.triadic?.map((c, i) => <ColorDisplayRow key={i} titleAs="h4" title={i === 0 ? 'Base' : `Triad ${i + 1}`} colorObj={c} gamutMode={gamutMode} />)}
                </div>
            </details>

            <details>
                <summary className="cursor-pointer transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-blue-400 dark:focus-visible:outline-blue-400">
                    <h3 className="inline text-base font-semibold text-gray-900 dark:text-white">
                        Tetradic Harmony
                    </h3>
                </summary>
                <div className="space-y-2 mt-3">
                    {harmonies.tetradic?.map((c, i) => <ColorDisplayRow key={i} titleAs="h4" title={i === 0 ? 'Base' : `Tetrad ${i + 1}`} colorObj={c} gamutMode={gamutMode} />)}
                </div>
            </details>
        </section>
    );
};

export default ColorHarmonies;
