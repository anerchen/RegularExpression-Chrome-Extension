var t = new WebFXTree('Result');

function test() {
  while (t.hasChildren()) {
    t.remove(t.lastChild);
  }

  var flags = (document.getElementById('multiline').checked ? 'm' : '') +
              (document.getElementById('ignore').checked ? 'i' : '');
  var global = document.getElementById('global').checked;
  var re = new RegExp(document.getElementById('regexp').value, flags);

  var sampleText = document.getElementById('sample-text').value;

  var startIndex = 0;
  var totalLength = sampleText.length;
  var result, pos;

  while (startIndex != totalLength) {
    result = re.exec(sampleText);
    if (result && result.length > 0 && result[0].length > 0) {
      pos = sampleText.indexOf(result[0]);
      startIndex += pos;
      var treeMatch = new WebFXTreeItem;
      treeMatch.setText(result[0]);
      for (var i = 1; i < result.length; i++) {
        var groupItem = new WebFXTreeItem;
        groupItem.setHtml(result[i] || '<span class=empty-group>Empty</span>');
        treeMatch.add(groupItem);
      }
      t.add(treeMatch);
      sampleText = sampleText.substr(pos + result[0].length);
      startIndex += result[0].length;
    } else {
      break;
    }
    if (!global) break;
  }
  t.expandAll();
}

function init() {
  var regExpEl = document.getElementById('regexp');
  var sampleEl = document.getElementById('sample-text');
  var globalEl = document.getElementById('global');
  var multilineEl = document.getElementById('multiline');
  var ignoreEl = document.getElementById('ignore');
  var helpIconEl = document.getElementById('help-icon');
  var helpEl = document.getElementById('help');

  if (regExpEl.addEventListener) {
    regExpEl.addEventListener('input', test, false);
    sampleEl.addEventListener('input', test, false);
  } else {
    regExpEl.onpropertychange = sampleEl.onpropertychange =
        handlePropertyChange;
  }
  globalEl.onclick = multilineEl.onclick = ignoreEl.onclick = test;
  helpIconEl.onclick = toggleHelp;
  helpIconEl.onblur = hideHelp;
}

function handlePropertyChange(e) {
  if (!e) e = window.event;
  if (e.propertyName == 'value') test();
}

function toggleHelp(e) {
  var el = document.getElementById('help');
  var shown = el.style.display == 'none';
  el.style.display = shown ? '' : 'none';
  return false;
}

function hideHelp(e) {
  var el = document.getElementById('help');
  el.style.display = 'none';
}

window.onload = function() {
  t.write();
  test();
  init();
};
