import React, {useState} from 'react';
import '@atlaskit/css-reset';
import iconMIT from '../../images/MITicon.png'
import iconTODO from '../../images/TODOicon.png'
import iconPLAN from '../../images/PLANicon.png'
import iconREWARD from '../../images/REWARDicon.png'
import styles from './Home.module.scss';
import items from "../../shared/data";
import {Grid, Paper} from "@material-ui/core";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import { Container, Row, Col } from 'react-bootstrap';

import imgCloud from '../../images/cloud.png'

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 1.5,
    margin: `0 0 5px 0`,

    // change background colour if dragging
    // background: isDragging ? "lightgreen" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "lightblue" : "#95b79d",
    // padding: grid,
    // width: 250
});



const emptyItems = {"items": []}

const initializeLocalStorage = () => {
    localStorage.setItem('droppableCloudList', JSON.stringify(items));
    localStorage.setItem('droppableMitList', JSON.stringify(emptyItems));
    localStorage.setItem('droppableTodoList', JSON.stringify(emptyItems));
    localStorage.setItem('droppablePlanList', JSON.stringify(emptyItems));
    localStorage.setItem('droppableRewardList', JSON.stringify(emptyItems));
    localStorage.setItem('droppableCompleted', JSON.stringify(emptyItems));
}

const resetLocalStorage = () => {
    localStorage.removeItem('droppableCloudList');
    localStorage.removeItem('droppableMitList');
    localStorage.removeItem('droppableTodoList');
    localStorage.removeItem('droppablePlanList');
    localStorage.removeItem('droppableRewardList');
    localStorage.removeItem('droppable');
}

let droppableCloudList;
if(!localStorage.getItem('droppableCloudList')){
    console.log('Initializing local storage...');
    initializeLocalStorage();
    droppableCloudList = JSON.stringify(items).items;
} else {
    droppableCloudList = JSON.parse(localStorage.getItem('droppableCloudList')).items;
}

const initializeDroppableLists = () => {
    return Array.from([
        {
            droppableId: 'droppableCloudList',
            items: JSON.parse(localStorage.getItem('droppableCloudList')).items
        },
        {
            droppableId: 'droppableMitList',
            items: JSON.parse(localStorage.getItem('droppableMitList')).items
        },
        {
            droppableId: 'droppableTodoList',
            items: JSON.parse(localStorage.getItem('droppableTodoList')).items
        },
        {
            droppableId: 'droppablePlanList',
            items: JSON.parse(localStorage.getItem('droppablePlanList')).items
        },
        {
            droppableId: 'droppableRewardList',
            items: JSON.parse(localStorage.getItem('droppableRewardList')).items
        },
        {
            droppableId: 'droppableCompleted',
            items: JSON.parse(localStorage.getItem('droppableCompleted')).items
        }
    ]);
}

const saveListToLocalStorage = (key, list) => {
    if (!key || !list) return;
    else {
        localStorage.setItem(key, JSON.stringify(list));
    }

}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const shouldInitialize = () => {
    return localStorage.getItem('droppableCloudList') ? false : true;
}

const addItemToCloud = (item) => {
    let droppableCloudList = JSON.parse(localStorage.getItem('droppableCloudList')).items;
    droppableCloudList = [...droppableCloudList, item];
    localStorage.setItem('droppableCloudList', JSON.stringify(droppableCloudList));
}


const Home = () => {
    resetLocalStorage();
    if(shouldInitialize()) {
        initializeLocalStorage();
    }
    const[droppableLists, setDroppableLists] = useState(initializeDroppableLists());
    return (
        <div>
            {/*<button type="button" onClick={() => initializeLocalStorage()}>Reset Lists</button>*/}
            {/*<button type="button" onClick={() => resetLocalStorage()}>Clear LocalStorage</button>*/}
            {/*<button type="button" onClick={() => addItemToCloud()}>Add New Cloud</button>*/}
            <DragDropContext onDragEnd={(result) => {
                if (!result.destination) return;
                else if (result.source.droppableId === result.destination.droppableId) {
                    const droppableListToUpdate = droppableLists.find(list => list.droppableId === result.source.droppableId);
                    const droppableListToUpdateIndex = droppableLists.findIndex(list => list.droppableId === result.source.droppableId);
                    const reorderedList = reorder(droppableListToUpdate.items, result.source.index, result.destination.index);
                    const clonedDroppableLists = droppableLists;
                    clonedDroppableLists[droppableListToUpdateIndex].items = reorderedList;
                    setDroppableLists(clonedDroppableLists);
                    saveListToLocalStorage(result.source.droppableId, reorderedList);
                } else {
                    const droppableListsClone = droppableLists;
                    const sourceDroppableList = droppableListsClone.find(list => list.droppableId === result.source.droppableId);
                    const sourceDroppableListIndex = droppableListsClone.findIndex(list => list.droppableId === result.source.droppableId);
                    const destinationDroppableList = droppableListsClone.find(list => list.droppableId === result.destination.droppableId);
                    const destinationDroppableListIndex = droppableListsClone.findIndex(list => list.droppableId === result.destination.droppableId);
                    const itemToMove = sourceDroppableList.items.find(item => item.id.toString() === result.draggableId);
                    // filter out the item that is being moved
                    sourceDroppableList.items = sourceDroppableList.items.filter(item => item.id.toString() !== itemToMove.id.toString());
                    destinationDroppableList.items = [...destinationDroppableList.items, itemToMove];
                    droppableListsClone[sourceDroppableListIndex] = sourceDroppableList;
                    droppableListsClone[destinationDroppableListIndex] = destinationDroppableList;
                    setDroppableLists(droppableListsClone);
                    saveListToLocalStorage(sourceDroppableList.droppableId, sourceDroppableList.items);
                    saveListToLocalStorage(destinationDroppableList.droppableId, destinationDroppableList.items);
                }
            }}>
            <div className={styles.cloud}>
                <Container>
                    <Row>
                        <Col>
                            <Droppable droppableId='droppableCloudList'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {/*<h5>Cloud</h5>*/}
                                        {droppableLists.find(list => list.droppableId === 'droppableCloudList').items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    </Row>
                </Container>
            </div>
            <hr style={{color: 'green'}}/>
                {/*      Quadrant Starts here      */}
                <Container>
                    <Row>
                        <Col className={styles.borderRightBottom}>
                            <img src={iconMIT} className={styles.iconRightBottom}/>
                            <Droppable droppableId='droppableMitList'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {droppableLists.find(list => list.droppableId === 'droppableMitList').items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                        <Col className={styles.borderLeftBottom}>
                            <img src={iconTODO} className={styles.iconLeftBottom}/>
                            <Droppable droppableId='droppableTodoList'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {droppableLists.find(list => list.droppableId === 'droppableTodoList').items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={styles.borderRightTop}>
                            <img src={iconPLAN} className={styles.iconRightTop}/>
                            <Droppable droppableId='droppablePlanList'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {droppableLists.find(list => list.droppableId === 'droppablePlanList').items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                        <Col className={styles.borderLeftTop}>
                            <img src={iconREWARD} className={styles.iconLeftTop}/>
                            <Droppable droppableId='droppableRewardList'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {droppableLists.find(list => list.droppableId === 'droppableRewardList').items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    </Row>
                </Container>
                <div className={styles.root}>
                    <hr style={{color: 'green'}}/>
                        <div className={styles.paper}>
                            <Droppable droppableId='droppableCompleted'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        >
                                            <h2><b>Completed!</b></h2>
                                            {droppableLists.find(list => list.droppableId === 'droppableCompleted').items.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                        {item.title}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            </div>
                </div>
            </DragDropContext>
        </div>
    );
}

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
