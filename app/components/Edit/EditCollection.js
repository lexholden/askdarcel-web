import React, { Component } from 'react';

/**
 * 
 * @param {Component} ResourceObjectItem individual component to have a collection for
 * @param {string} label title field for items
 * @param {Object[]} collection collection of items to make components of
 * @param {Object} blankTemplateObj blank template to fill new items in the collection with
 * @param {function} editCallbackFn call to modify root form scope
 */
export function editCollection(ResourceObjectItem,
                                label,
                                collection, 
                                blankTemplateObj, 
                                editCallbackFn
                                ) {
    class EditCollection extends Component {
        constructor(props) {
            super(props);

            this.state = {
                collection: collection
            }

            this.addItem = this.addItem.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.createItemComponents = this.createItemComponents.bind(this);
        }

        addItem() {
            let collection = this.state.collection;
            collection.push(blankTemplateObj);
            this.setState(collection);
        }

        handleChange(index, item) {
            let collection = this.state.collection;
            item.dirty = true;
            collection[i] = item;
            this.setState(collection, () => editCallbackFn(collection));
        }

        createItemComponents() {
            let collection = this.state.collection;
            let items = [];
            for(let i = 0; i < collection.length; i++) {
                items.push(
                    <ResourceObjectItem
                        key = {i}
                        index = {i}
                        item = {collection[i]}
                        handleChange = {this.handleChange}
                    />
                );
            }
        }

        render() {
            return (
                <div>
                    <div className="title-container">
                        <label>{label}</label>
                        <i className="material-icons" onClick={this.addItem}>note_add</i>
                    </div>
                    <ul className="edit-section-item">
                        {this.createItemComponents()}
                    </ul>
                </div>
            );
        }
    }
}