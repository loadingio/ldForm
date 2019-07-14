// Generated by LiveScript 1.3.1
var ldForm, slice$ = [].slice;
ldForm = function(opt){
  var root, fields, status, el, that, check, k, ref$, v, this$ = this;
  opt == null && (opt = {});
  this.opt = opt;
  this.root = root = typeof opt.root === 'string'
    ? ld$.find(document, opt.root, 0)
    : opt.root;
  this.evtHandler = {};
  this.fields = fields = {};
  this.status = status = {
    all: 1
  };
  this.el = el = {};
  if (opt.submit != null) {
    el.submit = typeof opt.submit === 'string'
      ? ld$.find(this.root, opt.submit, 0)
      : opt.submit;
  }
  if (!el.submit) {
    if (that = ld$.find(root, '[type=submit]', 0)) {
      el.submit = that;
    }
  }
  ['debounce', 'verify', 'names', 'getFields', 'afterCheck'].map(function(n){
    if (opt[n]) {
      return this$[n] = opt[n];
    }
  });
  check = function(e){
    return this$.check({
      n: e && e.target ? e.target.getAttribute('name') : undefined,
      e: e
    });
  };
  this.fields = fields = this.getFields(root);
  for (k in ref$ = opt.values || {}) {
    v = ref$[k];
    this.fields[k].value = v;
  }
  for (k in fields) {
    v = fields[k];
    v.addEventListener('change', check);
    v.addEventListener('keyup', check);
    status[k] = 1;
  }
  if (opt.init) {
    opt.init.apply(this);
  }
  return this;
};
ldForm.prototype = import$(Object.create(Object.prototype), {
  on: function(n, cb){
    var ref$;
    return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
  },
  fire: function(n){
    var v, i$, ref$, len$, cb, results$ = [];
    v = slice$.call(arguments, 1);
    for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
      cb = ref$[i$];
      results$.push(cb.apply(this, v));
    }
    return results$;
  },
  field: function(n){
    return this.fields[n];
  },
  reset: function(){
    var ref$, s, fs, this$ = this;
    ref$ = [this.status, this.fields], s = ref$[0], fs = ref$[1];
    s.all = 1;
    return this.names(s).map(function(n){
      fs[n].value = '';
      fs[n].classList.remove('is-invalid', 'is-valid');
      return s[n] = 1;
    });
  },
  ready: function(){
    return this.status.all === 0;
  },
  verify: function(n, v, e){
    return v ? 0 : 2;
  },
  names: function(){
    var k, results$ = [];
    for (k in this.fields) {
      results$.push(k);
    }
    return results$;
  },
  debounce: function(){
    return true;
  },
  afterCheck: function(){},
  values: function(){
    var ret, k, ref$, v;
    ret = {};
    for (k in ref$ = this.fields) {
      v = ref$[k];
      ret[k] = v.getAttribute('type') === 'checkbox'
        ? v.checked
        : v.value;
    }
    return ret;
  },
  getFields: function(root){
    var ret;
    ret = {};
    ld$.find(this.root, '[name]').map(function(f){
      return ret[f.getAttribute('name')] = f;
    });
    return ret;
  },
  checkDebounced: debounce(330, function(n, fs, s, res, rej){
    var names, len, all, that;
    names = this.names(s);
    this.afterCheck(s, fs);
    len = names.map(function(n){
      return s[n] != null && s[n] === 0;
    }).filter(function(it){
      return !it;
    }).length;
    all = s.all;
    s.all = !len ? 0 : 1;
    names.map(function(n){
      var x$;
      x$ = fs[n].classList;
      x$.toggle('is-invalid', s[n] === 2);
      x$.toggle('is-valid', s[n] < 1);
      return x$;
    });
    if (all !== s.all) {
      this.fire('readystatechange', s.all === 0);
    }
    if (that = this.el.submit) {
      that.classList.toggle('disabled', s.all !== 0);
    }
    return res();
  }),
  check: function(opt){
    var this$ = this;
    opt == null && (opt = {});
    return new Promise(function(res, rej){
      var ref$, n, e, now, fs, s;
      ref$ = {
        n: opt.n,
        e: opt.e,
        now: opt.now
      }, n = ref$.n, e = ref$.e, now = ref$.now;
      if (n != null && !this$.fields[n]) {
        return rej(new Error("ldForm.check: field " + n + " not found."));
      }
      ref$ = [this$.fields, this$.status], fs = ref$[0], s = ref$[1];
      if (fs[n]) {
        s[n] = this$.verify(n, fs[n].value, fs[n]);
      }
      if (this$.debounce(n, s) && !now) {
        return this$.checkDebounced(n, fs, s, res, rej);
      } else {
        return this$.checkDebounced(n, fs, s, res, rej).now();
      }
    });
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
