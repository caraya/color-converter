import React, { useMemo } from 'react';
import ColorDisplayRow from '/src/components/ColorDisplayRow.jsx';

const ColorScale = ({ colorObj }) => {
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
    <details>
      <summary className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        Color Scale
      </summary>
      <div className="space-y-2 mt-3">
        {scale.map((c, i) => (
          <ColorDisplayRow key={i} title={i === 5 ? 'Base Color' : `Step ${i - 5}`} colorObj={c} />
        ))}
      </div>
    </details>
  );
};

export default ColorScale;