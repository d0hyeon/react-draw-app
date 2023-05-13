import React from 'react';
import { css } from '@emotion/core';
import { InputNumber } from 'antd';
import { toolState } from 'src/features/drawing/tools/toolState';
import { useRecoilState } from 'recoil';

export function BrashNavigation () {
  const [tool, setTool] = useRecoilState(toolState);
  const onChangeCallback = React.useCallback(
    (value) => {
      setTool((prev) => ({ ...prev, lineWidth: value }));
    },
    [setTool],
  );

  React.useEffect(() => {
    const onKeyup = (event) => {
      const code = event.code;

      if (code.indexOf('Bracket') > -1) {
        const value = tool.lineWidth + (code === 'BracketRight' ? 1 : -1);
        if (value > 0 && value < 100) {
          onChangeCallback(value);
        }
      }
    };
    document.addEventListener('keyup', onKeyup);

    return () => document.removeEventListener('keyup', onKeyup);
  }, [onChangeCallback, tool.lineWidth]);

  return (
    <dl>
      <dt>size</dt>
      <dd>
        <InputNumber
          css={css`
            background-color: transparent;
            color: #fff;
          `}
          value={tool.lineWidth}
          onChange={onChangeCallback}
        />
      </dd>
    </dl>
  );
};
