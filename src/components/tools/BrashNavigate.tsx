import React from 'react';
import ToolContext from '../context/ToolContext';
import { css } from '@emotion/core';
import { InputNumber } from 'antd';

const BrashNavigate = () => {
  const [toolState, dispatch] = React.useContext(ToolContext);

  const onChangeCallback = React.useCallback(
    (value) => {
      dispatch({ type: 'patchToolStates', payload: { lineWidth: value } });
    },
    [dispatch],
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

export default React.memo(BrashNavigate);
