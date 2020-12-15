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

const _LayerItem: React.FC<LayerItemProps> = ({
  id,
  isCurrent,
  onDelete,
  onSelect,
}) => {
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
    <li
      key={id}
      className={`${isCurrent ? 'active' : ''}`}
      onClick={() => onSelect(id)}
    >
      <figure>
        <div className="frame">
          <img src={imageSrc} title={layer.title} onError={onErrorImage} />
        </div>
        <figcaption>
          <p>
            <ToggleInput
              defaultValue={layer.title}
              updateValue={onChangeTitle}
            />
          </p>
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
    setLayer((prev) => ({
      ...prev,
      layers: [nanoid(), ...prev.layers],
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

const LayerWrapperNav = styled.nav`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  background-color: #292c31;

  section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #000;

    & ~ section {
      border-top: 1px solid #000;
    }
    header {
      height: 30px;
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

    header,
    footer {
      &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        vertical-align: middle;
        content: '';
      }
    }

    footer {
      height: 30px;
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
  height: auto;

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
        background-color: rgba(255, 255, 255, 0.4);
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
