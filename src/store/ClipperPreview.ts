
import {
  observable, action,
} from 'mobx';

import TurndownService from 'turndown';
import Highlighter from '../services/common/highlight';

export interface ClipperPreiviewData {
  toBody(): string;
}

export class ClipperUrlPreiviewData implements ClipperPreiviewData {

  @observable href: string
  @observable mark: string

  constructor(href: string) {
    this.href = href;
  }

  @action setMark = (input: string) => {
    this.mark = input;
  }

  @action setHref = (input: string) => {
    this.href = input;
  }

  toBody = () => {
    return `## 链接 \n ${this.href} \n ## 备注 \n ${this.mark}`;
  }
}

//剪辑整个页面
export class ClipperFullPagePreiviewData implements ClipperPreiviewData {

  @observable fullPage: string

  constructor() {
    const $body = $('html').clone();
    $body.find('#yuque-clipper-tool-container').remove();
    $body.find('script').remove();
    $body.find('style').remove();
    $body.removeClass();
    const turndownService = TurndownService();
    this.fullPage = turndownService.turndown($body.html());
  }

  @action setFullPage = (input: string) => {
    this.fullPage = input;
  }

  toBody = () => {
    return this.fullPage;
  }
}

export class ClipperSelectedItemPreiviewData implements ClipperPreiviewData {

  @observable selectedItem: string

  private toolId: string;

  constructor(toolId: string) {
    this.selectedItem = '';
    this.toolId = toolId;
    this.clipWeb();
  }

  @action setFullPage = (input: string) => {
    this.selectedItem = input;
  }

  @action addMore = () => {
    this.clipWeb();
  }

  toBody = () => {
    return this.selectedItem;
  }
  private clipWeb = () => {
    $(`#${this.toolId}`).hide();
    new Highlighter().start().then(element => {
      const turndownService = TurndownService();
      this.selectedItem += turndownService.turndown($(element).html());
      $(`#${this.toolId}`).show();
    });
  }
}
