import React from 'react';
import { css } from '@emotion/core';
import { InputNumber } from 'antd';
import { tool } from 'src/atoms/toolState';
import { useRecoilState } from 'recoil';

export function BrashNavigate () {
  const [toolState, setToolState] = useRecoilState(tool);
  const onChangeCallback = React.useCallback(
    (value) => {
      setToolState((prev) => ({ ...prev, lineWidth: value }));
    },
    [setToolState],
  );

  React.useEffect(() => {
    const onKeyup = (event) => {
      const code = event.code;

      if (code.indexOf('Bracket') > -1) {
        const value = toolState.lineWidth + (code === 'BracketRight' ? 1 : -1);
        if (value > 0 && value < 100) {
          onChangeCallback(value);
        }
      }
    };
    document.addEventListener('keyup', onKeyup);

    return () => document.removeEventListener('keyup', onKeyup);
  }, [onChangeCallback, toolState.lineWidth]);

  return (
    <dl>
      <dt>size</dt>
      <dd>
        <InputNumber
          css={css`
            background-color: transparent;
            color: #fff;
          `}
          value={toolState.lineWidth}
          onChange={onChangeCallback}
        />
      </dd>
    </dl>
  );
};
