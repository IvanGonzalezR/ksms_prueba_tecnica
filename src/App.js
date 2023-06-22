import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import useFetchPhotos from './hooks/useFetchPhotos'

const App = () => {
  const [ moveableComponents, setMoveableComponents ] = useState([]);
  const [ selected, setSelected ] = useState(null);
  const parentRef = useRef(null);

  // Getting data from the API
  const { data } = useFetchPhotos()

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const objectFit = [ "fill", "contain", "cover", "scale-down", "none" ];

    // Get a random object from the object "data" between 0 and data.length
    const randomObject = data[ Math.floor(Math.random() * data.length) ]
    console.log(randomObject);

    // Get a random property from the objectFit array
    const randomObjectFit = objectFit[ Math.floor(Math.random() * objectFit.length) ];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: randomObject.id,
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        updateEnd: true,
        imageUrl: randomObject.url,
        fit: randomObjectFit
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [ handlePosX, handlePosY ] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        ref={parentRef}
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            fit={item.fit}
            parentRef={parentRef}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
  imageUrl,
  fit,
  parentRef,
}) => {
  const ref = useRef();
  const moveableRef = useRef();

  const [ nodoReferencia, setNodoReferencia ] = useState({
    top,
    left,
    width,
    height,
    index,
    id,
    imageUrl,
    fit
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      imageUrl,
      fit
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[ 0 ];
    let translateY = beforeTranslate[ 1 ];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: fit,
        }}
        onClick={() => { setSelected(id); console.log('Selected element: ' + id) }}
      />

      <Moveable
        ref={moveableRef}
        renderDirections={[ "nw", "n", "ne", "w", "e", "sw", "s", "se" ]}
        target={ref}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        resizable={isSelected}
        keepRatio={false}
        snappable={true}
        bounds={{ "left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css" }}
        edge={[]}
        origin={false}
        onDrag={e => {
          e.target.style.transform = e.transform;
          if (!isSelected) {
            setSelected(id);
          }
        }}
        onResize={onResize}
        verticalGuidelines={[ 50, 150, 250, 450, 550 ]}
        horizontalGuidelines={[ 0, 100, 200, 400, 500 ]}
      />
    </>
  );
};
