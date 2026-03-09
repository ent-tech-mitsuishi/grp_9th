import './device.js';
import './generate/index.js';
import $ from 'jquery';

if (document.body.dataset.page == 'top') {
  const loading = require('./common/loading.js');
  const users = require('./users.js');
  const download = require('./download.js');
}
