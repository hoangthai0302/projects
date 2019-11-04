/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  EditorState,
  ContentState,
  ContentBlock,
  genKey,
  convertToRaw,
  convertFromRaw,
  KeyBindingUtil,
  Modifier,
  AtomicBlockUtils,
  RichUtils,
  Entity,
} from 'draft-js';

import { List } from 'immutable'
import LOCAL_STORAGE from './../../constant'


import 'draft-js/dist/Draft.css';

import './index.scss';
import './components/addbutton.scss';
import './components/toolbar.scss';
import './components/blocks/text.scss';
import './components/blocks/atomic.scss';
import './components/blocks/blockquotecaption.scss';
import './components/blocks/caption.scss';
import './components/blocks/todo.scss';
import './components/blocks/image.scss';

var CodeUtils = require('draft-js-code');

import {
  Editor,
  StringToTypeMap,
  Block,
  keyBindingFn,
  createEditorState,
  addNewBlockAt,
  beforeInput,
  getCurrentBlock,
  ImageSideButton,
  rendererFn,
  HANDLED,
  NOT_HANDLED
} from './index';

const PrismDraftDecorator = require('draftjs-prism');
import {
  setRenderOptions,
  blockToHTML,
  entityToHTML,
  styleToHTML,
} from './exporter';


const newTypeMap = StringToTypeMap;
newTypeMap['2.'] = Block.OL;

const { hasCommandModifier } = KeyBindingUtil;

/*
A demo for example editor. (Feature not built into medium-draft as too specific.)
Convert quotes to curly quotes.
*/
const DQUOTE_START = '“';
const DQUOTE_END = '”';
const SQUOTE_START = '‘';
const SQUOTE_END = '’';

const newBlockToHTML = (block) => {
  const blockType = block.type;
  if (block.type === Block.ATOMIC) {
    if (block.text === 'E') {
      return {
        start: '<figure class="md-block-atomic md-block-atomic-embed">',
        end: '</figure>',
      };
    } else if (block.text === '-') {
      return <div className="md-block-atomic md-block-atomic-break"><hr/></div>;
    }
  }
  return blockToHTML(block);
};

const newEntityToHTML = (entity, originalText) => {
  if (entity.type === 'embed') {
    return (
      <div>
        <a
          className="embedly-card"
          href={entity.data.url}
          data-card-controls="0"
          data-card-theme="dark"
        >Embedded ― {entity.data.url}
        </a>
      </div>
    );
  }
  return entityToHTML(entity, originalText);
};

const handleBeforeInput = (editorState, str, onChange) => {
  if (str === '"' || str === '\'') {
    const currentBlock = getCurrentBlock(editorState);
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const text = currentBlock.getText();
    const len = text.length;
    if (selectionState.getAnchorOffset() === 0) {
      onChange(EditorState.push(editorState, Modifier.insertText(contentState, selectionState, (str === '"' ? DQUOTE_START : SQUOTE_START)), 'transpose-characters'));
      return HANDLED;
    } else if (len > 0) {
      const lastChar = text[len - 1];
      if (lastChar !== ' ') {
        onChange(EditorState.push(editorState, Modifier.insertText(contentState, selectionState, (str === '"' ? DQUOTE_END : SQUOTE_END)), 'transpose-characters'));
      } else {
        onChange(EditorState.push(editorState, Modifier.insertText(contentState, selectionState, (str === '"' ? DQUOTE_START : SQUOTE_START)), 'transpose-characters'));
      }
      return HANDLED;
    }
  }
  return beforeInput(editorState, str, onChange, newTypeMap);
};


class SeparatorSideButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const entityKey = Entity.create('separator', 'IMMUTABLE', {});
    this.props.setEditorState(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.getEditorState(),
        entityKey,
        '-'
      )
    );
    this.props.close();
  }

  render() {
    return (
      <button
        className="md-sb-button md-sb-img-button"
        type="button"
        title="Add a separator"
        onClick={this.onClick}
      >
        <i className="fa fa-minus" />
      </button>
    );
  }
}


class EmbedSideButton extends React.Component {

  static propTypes = {
    setEditorState: React.PropTypes.func,
    getEditorState: React.PropTypes.func,
    close: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.addEmbedURL = this.addEmbedURL.bind(this);
  }

  onClick() {
    const url = window.prompt('Enter a URL', 'https://www.youtube.com/watch?v=PMNFaAUs2mo');
    this.props.close();
    if (!url) {
      return;
    }
    this.addEmbedURL(url);
  }

  addEmbedURL(url) {
    const entityKey = Entity.create('embed', 'IMMUTABLE', {url});
    this.props.setEditorState(
      AtomicBlockUtils.insertAtomicBlock(
        this.props.getEditorState(),
        entityKey,
        'E'
      )
    );
  }

  render() {
    return (
      <button
        className="md-sb-button md-sb-img-button"
        type="button"
        title="Add an Embed"
        onClick={this.onClick}
      >
        <i className="fa fa-code" />
      </button>
    );
  }

}




class AtomicEmbedComponent extends React.Component {

  static propTypes = {
    data: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showIframe: false,
    };

    this.enablePreview = this.enablePreview.bind(this);
  }

  componentDidMount() {
    this.renderEmbedly();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showIframe !== this.state.showIframe && this.state.showIframe === true) {
      this.renderEmbedly();
    }
  }

  getScript() {
    const script = document.createElement('script');
    script.async = 1;
    script.src = '//cdn.embedly.com/widgets/platform.js';
    script.onload = () => {
      window.embedly();
    };
    document.body.appendChild(script);
  }

  renderEmbedly() {
    if (window.embedly) {
      window.embedly();
    } else {
      this.getScript();
    }
  }

  enablePreview() {
    this.setState({
      showIframe: true,
    });
  }

  render() {
    const { url } = this.props.data;
    const innerHTML = `<div><a class="embedly-card" href="${url}" data-card-controls="0" data-card-theme="dark">Embedded ― ${url}</a></div>`;
    return (
      <div className="md-block-atomic-embed">
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    );
  }
}

const AtomicSeparatorComponent = (props) => (
  <hr />
);

const AtomicBlock = (props) => {
  const { blockProps, block } = props;
  const entity = Entity.get(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (blockProps.components[type]) {
    const AtComponent = blockProps.components[type];
    return (
      <div className={`md-block-atomic-wrapper md-block-atomic-wrapper-${type}`}>
        <AtComponent data={data} />
      </div>
    );
  }
  return <p>Block of type <b>{type}</b> is not supported.</p>;
};


      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)
      [0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-XXXXXXXX-X', 'auto') ; 

      ga('send', 'pageview');


var FIRST_CODE = 'var message = "Hello World"\n    + "with four spaces indentation"\n\nconsole.log(message);';
var SECOND_CODE = 'var message = "Hello World"\n  + "with 2 spaces indentation"\n\nconsole.log(message);';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    var decorator = new PrismDraftDecorator();

    var contentState = convertFromRaw({
            entityMap: {},
            blocks: [
                {
                    type: 'header-one',
                    text: 'Demo for draft-js-code'
                },
                {
                    type: 'unstyled',
                    text: 'Type some JavaScript below, Use "Command+Return" (or "Ctrl+Return" on Windows) to split/exit a code blocks:'
                },
                {
                    type: 'code-block',
                    text: FIRST_CODE
                },
                {
                    type: 'unstyled',
                    text: 'And this is a code block with 2 spaces indentation'
                },
                {
                    type: 'code-block',
                    text: SECOND_CODE
                }
            ]
        })

      
    this.state = {
      editorState: EditorState.createWithContent(contentState, decorator),
      editorEnabled: true,
      placeholder: 'Write here...',
    };

    this.onChange = (editorState, callback = null) => {
      if (this.state.editorEnabled) {
        this.setState({ editorState }, () => {
          if (callback) {
            callback();
          }
        });
      }
    };

    this.sideButtons = [{
      title: 'Image',
      component: ImageSideButton,
    }, {
      title: 'Embed',
      component: EmbedSideButton,
    }, {
      title: 'Separator',
      component: SeparatorSideButton,
    }];

    this.exporter = setRenderOptions({
      styleToHTML,
      blockToHTML: newBlockToHTML,
      entityToHTML: newEntityToHTML,
    });

    this.getEditorState = () => this.state.editorState;

    this.logData = this.logData.bind(this);
    this.renderHTML = this.renderHTML.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.loadSavedData = this.loadSavedData.bind(this);
    window.loadSavedData = this.loadSavedData;
    this.keyBinding = this.keyBinding.bind(this);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.onTab = (e) => this._onTab(e);
    this.onReturn = (e) => this._onReturn(e);
  }

  componentDidMount() {
    setTimeout(this.fetchData, 1000);
  }

  rendererFn(setEditorState, getEditorState) {
    const atomicRenderers = {
      embed: AtomicEmbedComponent,
      separator: AtomicSeparatorComponent,
    };
    const rFnOld = rendererFn(setEditorState, getEditorState);
    const rFnNew = (contentBlock) => {
      const type = contentBlock.getType();
      switch(type) {
        case Block.ATOMIC:
          return {
            component: AtomicBlock,
            editable: false,
            props: {
              components: atomicRenderers,
            },
          };
        default: return rFnOld(contentBlock);
      }
    };
    return rFnNew;
  }

  keyBinding(e) {
    let editorState = this.state.editorState;
    let command;

    /*if (CodeUtils.hasSelectionInBlock(editorState)) {
        command = CodeUtils.getKeyBinding(e);
    }
    if (command) {
        return command;
    }*/

        //return Draft.getDefaultKeyBinding(e);



    if (hasCommandModifier(e)) {
      if (e.which === 83) {  /* Key S */
        return 'editor-save';
      }
     else if (e.which === 76 /* Key L */) {
      return 'load-saved-data';
      }
    }
    if (e.altKey === true) {
      if (e.shiftKey === true) {
        switch (e.which) {
          /* Alt + Shift + L */
          case 76: return 'load-saved-data';
          /* Key E */
          // case 69: return 'toggle-edit-mode';
        }
      }
      if (e.which === 72 /* Key H */) {
        return 'toggleinline:HIGHLIGHT';
      }
    }
    return keyBindingFn(e);
  }

  _handleKeyCommand(command) {
    if (command === 'editor-save') {
      //window.localStorage['editor'] = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
      var data = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
      var path = localStorage.getItem('notes_current_path');
          if(path){
            var postData = {path:path, content:data};
            $.ajax({
                  url: '/api/saveFile',
                  type: 'post',
                  dataType:'json',
                  contentType:'application/json',
                  data: JSON.stringify(postData),
                  success: function (data) {
                      
                  }
                
            });
          }

          const {editorState} = this.state;
        let newState;

       /* if (CodeUtils.hasSelectionInBlock(editorState)) {
            newState = CodeUtils.handleKeyCommand(editorState, command);
        }*/

        if (!newState) {
            newState = RichUtils.handleKeyCommand(editorState, command);
        }

        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;


      window.ga('send', 'event', 'draftjs', command);
      //return true;
    } else if (command === 'load-saved-data') {
      this.loadSavedData();
      return true;
    } else if (command === 'toggle-edit-mode') {
      this.toggleEdit();
    }
    return false;
  }

  fetchData() {
    window.ga('send', 'event', 'draftjs', 'load-data', 'ajax');
    this.setState({
      placeholder: 'Loading...',
    });
    const req = new XMLHttpRequest();
    req.open('GET', 'data.json', true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const data = JSON.parse(req.responseText);
        this.setState({
          editorState: createEditorState(data),
          placeholder: 'Write here...'
        }, () => {
          this._editor.focus();
        });
        window.ga('send', 'event', 'draftjs', 'data-success');
      }
    };
    req.send();
  }

  logData(e) {
    const currentContent = this.state.editorState.getCurrentContent();
    const es = convertToRaw(currentContent);
    console.log(es);
    console.log(JSON.stringify(es));
    window.ga('send', 'event', 'draftjs', 'log-data');
  }

  renderHTML(e) {
    const currentContent = this.state.editorState.getCurrentContent();
    const eHTML = this.exporter(currentContent);
    var newWin = window.open(
      `${window.location.pathname}rendered.html`,
      'windowName',`height=${window.screen.height},width=${window.screen.wdith}`);
    newWin.onload = () => newWin.postMessage(eHTML, window.location.origin);
  }

  loadSavedData() {
    const data = window.localStorage.getItem('note-data');
    if (data === null) {
      return;
    }
    try {
      const blockData = JSON.parse(data);
      this.onChange( EditorState.push(this.state.editorState, convertFromRaw(blockData)), this._editor.focus);
    } catch(e) {
      var blockData = {"entityMap":{},"blocks":[{"key":"bh33t","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5k7ih","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      this.onChange( EditorState.push(this.state.editorState, convertFromRaw(blockData)), this._editor.focus);
    }
    window.ga('send', 'event', 'draftjs', 'load-data', 'localstorage');
  }

  toggleEdit(e) {
    this.setState({
      editorEnabled: !this.state.editorEnabled
    }, () => {
      window.ga('send', 'event', 'draftjs', 'toggle-edit', this.state.editorEnabled + '');
    });
  }

  handleDroppedFiles(selection, files) {
    console.log("file dropped");
    window.ga('send', 'event', 'draftjs', 'filesdropped', files.length + ' files');
    const file = files[0];
    console.log(file.type);
    if (file.type.indexOf('image/') === 0) {
      // eslint-disable-next-line no-undef
      //const src = URL.createObjectURL(file);
      var formData = new FormData();
      formData.append("file", file);
       var that = this;
      $.ajax({
         url: '/api/upload',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                var name = file.name;
                var src = '/img/' + name;
                
                that.onChange(addNewBlockAt(
                  that.state.editorState,
                  selection.getAnchorKey(),
                  Block.IMAGE, {
                    src,
                  }
                ));
                
            }
      });

      


      return HANDLED;
    }
    return NOT_HANDLED
  }
 _onTab(e) {
        let editorState = this.state.editorState;

        if (!CodeUtils.hasSelectionInBlock(editorState)) {
            return;
        }

        this.onChange(
            CodeUtils.handleTab(e, editorState)
        )
    }


  _onReturn(e) {
     /*let editorState = this.state.editorState;

        if (!CodeUtils.hasSelectionInBlock(editorState)) {
            return;
        }

        this.onChange(
            CodeUtils.handleReturn(e, editorState)
        )*/
        
    // const currentBlock = getCurrentBlock(this.state.editorState);
    // var text = currentBlock.getText();
    return NOT_HANDLED;
  }

  render() {
    const { editorState, editorEnabled } = this.state;
    return (
      <div>
        <div className="editor-action">
          <button onClick={this.renderHTML}>Render HTML</button>
          <button onClick={this.toggleEdit}>Toggle Edit</button>
        </div>
        <Editor
          ref={(e) => {this._editor = e;}}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}

          editorState={editorState}
          onChange={this.onChange}
          editorEnabled={editorEnabled}
          handleDroppedFiles={this.handleDroppedFiles}
          handleKeyCommand={this.handleKeyCommand}
          placeholder={this.state.placeholder}
          keyBindingFn={this.keyBinding}
          beforeInput={handleBeforeInput}
          handleReturn={this.onReturn}
          onTab={this.onTab}
          sideButtons={this.sideButtons}
          rendererFn={this.rendererFn}
        />
      </div>
    );
  }
};

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

export default MyEditor