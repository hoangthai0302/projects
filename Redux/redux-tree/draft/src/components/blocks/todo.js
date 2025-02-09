// import './todo.scss';

import React, { PropTypes } from 'react';
import { EditorBlock } from 'draft-js';

import { updateDataOfBlock } from '../../model/';

export default class TodoBlock extends React.Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
  }

  updateData() {
    const { block, blockProps } = this.props;
    const { setEditorState, getEditorState } = blockProps;
    const data = block.getData();
    const checked = (data.has('checked') && data.get('checked') === true);
    const newData = data.set('checked', !checked);
    setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  }

  render() {
    const data = this.props.block.getData();
    const checked = data.get('checked') === true;
    return (
      <div className={'md-block-todo'}>
        <input type="checkbox" checked={checked} onChange={this.updateData} />
        <EditorBlock {...this.props} />
      </div>
    );
  }
}


TodoBlock.propTypes = {
  block: PropTypes.object,
  blockProps: PropTypes.object,
};
