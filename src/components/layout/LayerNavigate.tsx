import React from 'react';
import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';
import { layer, layerEntity } from 'src/atoms/layer';
import { ID } from 'src/types/common';
import { nanoid } from 'nanoid';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ToggleInput from '../common/ToggleInput';

interface LayerItemProps {
  id: ID;
  isCurrent: boolean;
  onDelete: (id: ID) => void;
  onSelect: (id: ID) => void;
}

const _LayerItem: React.FC<LayerItemProps> = ({ id, isCurrent, onDelete, onSelect }) => {
  const [layer, setLayer] = useRecoilState(layerEntity(id));

  const canvas = layer.canvas;
  const imageSrc = canvas?.toDataURL?.() ?? '';

  const onChangeTitle = React.useCallback((value) => {
    setLayer((prev) => ({
      ...prev,
      title: value,
    }));
  }, []);

  const onErrorImage = React.useCallback(
    ({ target }) => {
      target.parentNode.removeChild(target);
    },
    [imageSrc],
  );
  return (
    <li key={id} className={`${isCurrent ? 'active' : ''}`} onClick={() => onSelect(id)}>
      <figure>
        <div className="frame">
          <img src={imageSrc} title={layer.title} onError={onErrorImage} />
        </div>
        <figcaption>
          <ToggleInput defaultValue={layer.title} updateValue={onChangeTitle} />
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="delete"
            >
              <DeleteOutlined />
            </button>
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const LayerItem = React.memo(_LayerItem);

const LayerNavigate = () => {
  const [{ currentLayerId, layers }, setLayer] = useRecoilState(layer);
  const layerSelectHandler = React.useCallback((layerId) => {
    setLayer((prev) => ({
      ...prev,
      currentLayerId: layerId,
    }));
  }, []);
  const layerDeleteHandler = React.useCallback(
    (layerId) => {
      let deleteIdx = 0;
      const deletedLayers = layers.filter((id, index) => {
        const targetLayer = layerId === id;
        if (targetLayer) {
          deleteIdx = index;
          return false;
        }
        return true;
      });

      setLayer((curr) => ({
        ...curr,
        layers: deletedLayers,
        ...(layerId === currentLayerId && {
          currentLayerId: layers[deleteIdx - 1] ?? layers[deleteIdx + 1] ?? '',
        }),
      }));
    },
    [layers, currentLayerId],
  );
  const layerAddHandler = React.useCallback(() => {
    const createLayerId = nanoid();
    setLayer((prev) => ({
      currentLayerId: createLayerId,
      layers: [createLayerId, ...prev.layers],
    }));
  }, []);

  return (
    <LayerWrapperNav>
      <section>
        <header>
          <h3>Layers</h3>
        </header>
        <LayerListUl>
          {layers.map((id) => (
            <LayerItem
              key={id}
              id={id}
              isCurrent={currentLayerId === id}
              onDelete={layerDeleteHandler}
              onSelect={layerSelectHandler}
            />
          ))}
        </LayerListUl>
        <footer>
          <button className="add" onClick={layerAddHandler}>
            <PlusOutlined />
          </button>
        </footer>
      </section>
    </LayerWrapperNav>
  );
};

export default LayerNavigate;

const LayerWrapperNav = styled.aside`
  height: 100%;
  width: 300px;
  background-color: #292c31;
  display: flex;
  flex-direction: column;

  section {
    position: relative;
    height: 100%;
    padding: 30px 0;
    border-bottom: 1px solid #000;

    & ~ section {
      border-top: 1px solid #000;
    }

    .body {
      overflow-y: auto;
    }

    header,
    footer {
      position: absolute;
      left: 0;
      height: 30px;
      width: 100%;
      &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        vertical-align: middle;
        content: '';
      }
    }

    header {
      top: 0;
      text-align: center;
      font-size: 0;
      border-bottom: 1px solid #000;

      h3 {
        display: inline-block;
        font-size: 14px;
        color: #fff;
        vertical-align: middle;
      }
    }

    footer {
      bottom: 0;
      vertical-align: middle;
      text-align: center;
      button {
        padding: 0 20px;
        vertical-align: middle;
        color: #fff;
      }
    }
  }
`;

const LayerListUl = styled.ul`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  li {
    position: relative;
    padding: 5px;
    cursor: pointer;

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    figure {
      display: flex;
      margin: 0;

      .frame {
        flex: 0 0 40px;
        height: 40px;
        width: 40px;
        margin-right: 5px;
        border: 1px solid #fff;
        background-image: url('https://pixlr.com/img/misc/square-bg.png');
        background-size: 80%;
      }

      figcaption {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p {
          margin: 0;
          color: #fff;
          font-size: 12px;
        }

        > div {
          text-align: right;
        }

        button {
          width: 20px;
          height: 20px;
          color: #fff;
          vertical-align: middle;
        }
      }
    }
  }
`;
