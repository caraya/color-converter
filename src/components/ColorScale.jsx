import React, { useMemo } from 'react';
import ColorDisplayRow from '/src/components/ColorDisplayRow.jsx';

const ColorScale = ({ colorObj, gamutMode = 'space' }) => {
  const scale = useMemo(() => {
    if (!colorObj) return [];
    try {
      const lighter = colorObj.steps('white', { space: 'oklch', outputSpace: 'srgb', steps: 7 }).slice(1, 6);
      const darker = colorObj.steps('black', { space: 'oklch', outputSpace: 'srgb', steps: 7 }).slice(1, 6);
      return [...lighter.reverse(), colorObj, ...darker];
    } catch (e) {
      console.error("Error creating color scale:", e);
      return [];
    }
  }, [colorObj]);

  if (!colorObj || scale.length === 0) return null;

  return (
    <section aria-labelledby="color-scale-heading">
      <details>
        <summary className="cursor-pointer transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-blue-400 dark:focus-visible:outline-blue-400">
          <h2 id="color-scale-heading" className="inline text-lg font-bold text-gray-900 dark:text-white">
            Color Scale
          </h2>
        </summary>
        <div className="space-y-2 mt-3">
          {scale.map((c, i) => (
            <ColorDisplayRow key={i} titleAs="h3" title={i === 5 ? 'Base Color' : `Step ${i - 5}`} colorObj={c} gamutMode={gamutMode} />
          ))}
        </div>
      </details>
    </section>
  );
};

export default ColorScale;