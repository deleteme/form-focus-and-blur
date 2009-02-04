// Example Usage
//   var formFocuser = new FormFocusAndBlur({ wrapperTagName: 'div[class*=form-block]' });

var FormFocusAndBlur = Class.create({
  
  initialize: function(options){
    
    this.defaultOptions = {
      className: 'focused',
      wrapperTagName: 'div.field',
      formElementsSelectorArray: ['input[type=text]', 'input[type=password]', 'input[type=radio]', 'input[type=checkbox]', 'textarea', 'select']
    };
    
    // set options as objects bound to this
    $H(this.defaultOptions).merge(options).each(function(option){
      this[option.key] = option.value;
    }.bind(this));
    
    // modify selector array to include wrapper tag name
    this.formElementsSelectorArray = this.formElementsSelectorArray.map(function(selector){
      return this.wrapperTagName + ' ' + selector;
    }.bind(this));
    
    document.observe('dom:loaded', this.setup.bind(this));
    
  },
  
  setup: function(){
    this.formElements = $$(this.formElementsSelectorArray).each(this.startObserving.bind(this));
  },
  
  toggleHighlight: function(addingClassName, e){
    var parent = e.element().up(this.wrapperTagName);
    if (parent.hasClassName('fieldWithErrors')) parent = parent.up(this.wrapperTagName);
    
    if (addingClassName) parent.addClassName(this.className);
    else parent.removeClassName(this.className);
  },
  
  startObserving: function(formElement){
    formElement.observe('focus', this.toggleHighlight.curry(true).bind(this)).observe('blur', this.toggleHighlight.curry(false).bind(this));
  },
  
  stopObserving: function(){
    this.formElements.invoke('stopObserving', 'focus').invoke('stopObserving', 'blur');
  },
  
  reInit: function(){
    this.stopObserving();
    this.setup();
  }
  
});
