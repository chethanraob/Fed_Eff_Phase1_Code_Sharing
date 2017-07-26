(function() {
  'use strict';

  Polymer({
    is: 'px-slider',
    properties: {
      /**
       * Height of the svg: calculated from container size
       */
      _height: {
        type: Number,
        value: 52
      },

      /**
       * Width of the svg: calculated from container size
       */
      _width: {
        type: Number,
        value: 52
      },

      /**
       * Margin for the svg elems centering the bars and providing space around them for the handles
       */
      _margin:{
        type:Object,
        notify: true,
        value: function() {
          return {
            left: 13,
            right: 13,
            top: 21,
            bottom: 21
          };
        }
      },

      /**
      * For single sliders: the value for the slider's handle.
      * For multi-handled/ranged sliders: the value for the left / start slider's handle.
      */
      value: {
        type: Number,
        notify: true,
        value: 0
      },

      /**
      * For multi-handled/ranged sliders only: the value of the right handle / end of the selected range.
      */
      endValue: {
        type: Number,
        notify: true,
        value: null
      },

      /**
       * The display value for the left input box
       */
      formattedStartValue: {
        type: String
      },

      /**
       * The display value for the right input box
       */
      formattedEndValue: {
        type: String
      },

      /**
       * A minimum value for the slider. The user cannot choose less than the min.
       */
      min: {
        type: Number,
        value: 1
      },
      /**
       * A maximum value for the slider. The user cannot choose greater than the max.
       */
      max: {
        type: Number,
        value: 100
      },
      /**
       * A trigger that is greater than 0 if the min and max are valid
       */
      _minMaxValid: {
        type: Number,
        value: 0
      },
      /**
      * Specifies the step size for the slider values.
      *
      * For example:
      * Setting step to 10 limits values to multiples of 10 over the min value.
      * The default of 1 ensures that you only get integers for your value.
      */
      step: {
        type: Number,
        value: 1,
        observer: '_stepChanged'
      },
      /**
       * A boolean reflecting whether the slider is disabled or not.
       */
      disabled: {
        type: Boolean,
        value: false,
        observer: '_setupListeners'
      },

      /**
       * A boolean reflecting whether the text input fields should be hidden.
       */
      hideInputs: {
        type: Boolean,
        value: false
      },

      /**
       * A boolean specifying if the first input box should be shown
       */
      _showStartInput: {
        type: Boolean,
        value: true
      },

      /**
       * A boolean specifying if the second input box should be shown
       */
      _showEndInput: {
        type: Boolean,
        value: false
      },

      /**
       * Boolean specifying if we are dealing with a single slider or a range
       */
      isRange: {
        type: Boolean,
        value: false
      },

      /**
       * The scale by which the slider operates - currently supports:
       * - `linear`
       * - `logarithmic`
       * - `exponential`
       */
      scale: {
        type: String,
        value: "linear",
        observer: '_createScale'
      },

      /**
       * The base number only for logarithmic scales
       */
      base: {
        type: Number,
        value: 10
      },

      /**
       * The exponent number only for exponential scales
       */
      exponent: {
        type: Number,
        value: 1
      },

      /**
       * Holder object for the scale function
       */
      _scale: {
        type: Function
      },

      /**
       * A trigger for changes in the scale range or domain
       */
      _scaleChanged: {
        type: Boolean
      },

      /**
       * A holder for the handle d3 selected elem
       */
      _startHandle: {
        type: Object
      },

      /**
       * A holder for the handle d3 selected elem
       */
      _endHandle: {
        type: Object
      },

      /**
       * A holder for the start input elem
       */
      _inputStart: {
        type: HTMLElement
      },

      /**
       * A holder for the end input elem
       */
      _inputEnd: {
        type: HTMLElement
      },

      /**
       * The format string used to format the number in the input box
       */
      _format: {
        type: String,
        value: "0"
      },

      /**
       * Specifies if the min and max slider labels should be shown
       */
      showLabels: {
        type: Boolean,
        value: false
      },

      /**
       * The vertical location for the Min label. Valid values are:
       * - 'bottom' (default)
       * - 'top'
       */
      minLabelPosition: {
        type: String,
        value: "bottom"
      },

      /**
       * The vertical location for the Max label. Valid values are:
       * - 'bottom' (default)
       * - 'top'
       */
      maxLabelPosition: {
        type: String,
        value: "bottom"
      },

      /**
       * The path definitions for the handles
       */
      _handleDefinitions: {
        type: Object,
        value: function() {
          return {
            "square": {
              "shadowD": "M-11,-1a3,3,0,0,1,3-3h16a3,3,0,0,1,3,3v15a3,3,0,0,1,-3,3h-16a3,3,0,0,1,-3-3Z",
              "bodyD": "M-11,-2a3,3,0,0,1,3-3h16a3,3,0,0,1,3,3v15a3,3,0,0,1,-3,3h-16a3,3,0,0,1,-3-3Z",
              "linesY1": "2",
              "linesY2": "9"
            },
            "down": {
              "shadowD": "M-10.5,-16a3,3,0,0,1,3-3h16a3,3,0,0,1,3,3v9l-10.5,8h-1l-10.5,-8Z",
              "bodyD": "M-10.5,-17a3,3,0,0,1,3-3h16a3,3,0,0,1,3,3v9l-10.5,8h-1l-10.5,-8Z",
              "linesY1": "-15",
              "linesY2": "-8"
            },
            "up": {
              "shadowD": "M11,18.5v9c0,1.7-1.3,3-3,3h-16c-1.7,0-3-1.3-3-3v-9l10.5,-8h1l10.5,8Z",
              "bodyD": "M11,17.5v9c0,1.7-1.3,3-3,3h-16c-1.7,0-3-1.3-3-3v-9l10.5,-8h1l10.5,8Z",
              "linesY1": "18",
              "linesY2": "25"
            }
          };
        }
      }
    },
    behaviors: [
      Polymer.IronResizableBehavior,
      PxNumberFormatter.commonProperties
    ],
    listeners: {
      'iron-resize': '_onIronResize'
    },
    observers: [
      '_minOrMaxChanged(min, max)',
      '_setRange(_scale, _width, _height)',
      '_setDomain(_scale, _minMaxValid)',
      '_valueChanged(value, _scale, _scaleChanged)',
      '_endValueChanged(endValue, _scale, _scaleChanged)',
      '_updateFormat(step)',
      '_updateFormat(format)',
      '_isRangeChanged(isRange)',
      '_hideInputsChanged(hideInputs)'
    ],

    ready() {
      window.requestAnimationFrame(this._animationFrame.bind(this));
    },

    attached() {
      this.setAttribute('role','slider');
    },

    /**
     * Do general setup on our svg once we have an animation frame and know stuff exists
     * - create listeners
     * - draw our handles
     */
    _animationFrame() {
      // get the d3 selected handles
      // since the group elems both exist, we dont have to do anything on isRange change
      var startHandle = Px.d3.select(this.$$('#handleStart'));
      var endHandle = Px.d3.select(this.$$('#handleEnd'));

      // save the d3 selected handles
      this.set('_startHandle', startHandle);
      this.set('_endHandle', endHandle);

      // initial config for our handle paths
      this._buildHandles();

      // set up our listeners
      this._setupListeners();
    },

    /**
     * Setup our listeners
     */
    _setupListeners() {
      if(this._startHandle && this._endHandle) {
        if(this.disabled) {
          this._removeHandleListeners();
          this._removeTrackListeners();

        } else {
          // create our drag and hover,etc  states
          this._createHandleListeners(this._startHandle, 'value');
          this._createHandleListeners(this._endHandle, 'endValue');

          // setup click listeners on the track and bars
          this._createTrackListeners();
        }

        // add or remove disabled class
        this._toggleDisabledClass();
      }
    },

    /**
     * Creates the drag behavior and hover, pressed states for the handles.
     */
    _createHandleListeners(handle, valueVar) {
      var handleBody = handle.select('.handleBody'),
          handleLines = handle.selectAll('.handleLines'),
          handleShadow = handle.select('.handleDropShadow');

      handle.call(Px.d3.drag()
        .on("start.interrupt", function() { handle.interrupt(); })
        .on("start drag", function() {
          // apply styling
          handleBody.classed("handleBodyPressed", true);
          handleLines.classed("handleLinesPressed", true);
          handleShadow.classed("handleDropShadowPressed", true);

          // TODO for vertical: check state, pass in d3.event.y
          this._calcSliderValue(Px.d3.event.x, valueVar);

        }.bind(this))
        .on("end", function() {
          // remove styling
          handleBody.classed("handleBodyPressed", false);
          handleLines.classed("handleLinesPressed", false);
          handleShadow.classed("handleDropShadowPressed", false);
        })
      )
      .on("mouseenter", function() {
        handleBody.classed("handleBodyHover", true);
        handleLines.classed("handleBodyHover", true);
      })
      .on("mouseleave", function() {
        handleBody.classed("handleBodyHover", false);
        handleLines.classed("handleBodyHover", false);
      });
    },

    /**
     * Creates the click listeners on the progress bars to enable click to jump value
     */
    _createTrackListeners() {
      var _this = this,
          interactionRects = Px.d3.selectAll(Polymer.dom(this.$$('#sliderSVG')).querySelectorAll('.sliderTrack'));

      interactionRects.on('click', function() {
        // need access to callback this, so pass it in
        _this._trackOnClick(this);
      });
    },

    /**
     * The actual callback for our track on click
     */
    _trackOnClick(elem) {
      // TODO vertical: [1]
      var val = Px.d3.mouse(elem)[0], // Get the mouse position
          prop = 'value';  //assume it should affect the left value

      if(this.isRange) {
        //check to see which is closer
        var scaled = this._scale.invert(val),
            half = (this.endValue - this.value) / 2 + this.value;

        prop = (scaled > this.endValue || scaled > half) ? 'endValue' : 'value';
      }

      this._calcSliderValue(val, prop);
    },

    /**
     * Clears the listeners from the handles
     */
    _removeHandleListeners() {
      this._startHandle.on(".drag", null);
      this._endHandle.on(".drag", null);
    },

    /**
     * clears the listeners from the track
     */
    _removeTrackListeners() {
      var interactionRects = Px.d3.selectAll(Polymer.dom(this.$$('#sliderSVG')).querySelectorAll('.sliderTrack'));

      interactionRects.on('click', null);
    },

    /**
     * For flexibility and efficiency, the basic paths and lines are already loaded into the dom.
     * We just need to actually add paths, etc so they are not invisible, which is what this function does.
     * This way, we dont have to do special setup in range vs single mode, just dont draw the other handle
     * when in single mode and just morph the drawing of the single handle when in range mode.
     */
    _buildHandles() {
      if(this._handleDefinitions && this._startHandle && this._endHandle) {
        if(this.isRange) {

          this._startHandle.select('.handleDropShadow')
            .attr("d", this._handleDefinitions.up.shadowD);
          this._startHandle.select('.handleBody')
            .attr("d", this._handleDefinitions.up.bodyD);
          this._startHandle.selectAll('.handleLines')
            .attr("y1", this._handleDefinitions.up.linesY1)
            .attr("y2", this._handleDefinitions.up.linesY2);

          this._endHandle.select('.handleDropShadow')
            .attr("d", this._handleDefinitions.down.shadowD);
          this._endHandle.select('.handleBody')
            .attr("d", this._handleDefinitions.down.bodyD);
          this._endHandle.selectAll('.handleLines')
            .attr("y1", this._handleDefinitions.down.linesY1)
            .attr("y2", this._handleDefinitions.down.linesY2);

        } else {
          this._startHandle.select('.handleDropShadow')
            .attr("d", this._handleDefinitions.square.shadowD);
          this._startHandle.select('.handleBody')
            .attr("d", this._handleDefinitions.square.bodyD);
          this._startHandle.selectAll('.handleLines')
            .attr("y1", this._handleDefinitions.square.linesY1)
            .attr("y2", this._handleDefinitions.square.linesY2);

          // remove end handle:
          this._endHandle.select('.handleDropShadow')
            .attr("d", null);
          this._endHandle.select('.handleBody')
            .attr("d", null);
          this._endHandle.selectAll('.handleLines')
            .attr("y1", null)
            .attr("y2", null);
        }
      }
    },

    /**
     * saves our input fields as a property for conveinence
     */
    _assignInputElems() {
      // make  sure those dom-ifs have run
      Polymer.dom.flush();

      this.set('_inputStart', this.$$('#inputStart'));
      this.set('_inputEnd', this.$$('#inputEnd'));
    },

    /**
     * Resizes the slider based on parent box size
     */
    _onIronResize() {
      // TODO enable this?
      // if(this.preventResize) {
      //   return;
      // }
      this.debounce('ironresize', function() {
        // TODO vertical version
        // check if type is vertical; if so set height, otherwise set width
        var wrapperRect = this.$.wrapper.getBoundingClientRect(),
            startInputSize = this._inputStart ? this._inputStart.getBoundingClientRect().width : 0,
            startInputMargin = this._inputStart ? Number(window.getComputedStyle(this._inputStart).marginRight.split('px')[0]) : 0,
            endInputSize = this._inputEnd ? this._inputEnd.getBoundingClientRect().width : 0,
            endInputMargin = this._inputEnd ? Number(window.getComputedStyle(this._inputEnd).marginLeft.split('px')[0]) : 0,
            w = wrapperRect.width - startInputSize - endInputSize - startInputMargin - endInputMargin - this._margin.left - this._margin.right;

        this.set('_width', Math.max(w, 0));
        // this.set('_height', Math.max(h, 0));
      }, 10);
    },

    /**
     * Shows or hides the input boxes based on settings. Triggers the dom-ifs in the Template
     */
    _hideInputsChanged() {
      if(this.hideInputs) {
        this.set('_showStartInput', false);
        this.set('_showEndInput', false);
      } else {
        this.set('_showStartInput', true);
        this.set('_showEndInput', this.isRange);
      }

      this._assignInputElems();
      this.notifyResize();
    },

    /**
     * Returns the width to be used for the svg
     */
    _getSvgWith() {
      return this._width + this._margin.left + this._margin.right;
    },
    /**
     * Returns the height to be used for the svg
     */
    _getSvgHeight() {
      return this._height + this._margin.top + this._margin.bottom;
    },

    /**
     * Calculates the transform for the svg elems
     */
    _calcTransform() {
      return 'translate(' + this._margin.left + ',' + this._margin.top + ')';
    },

    /**
     * Validates that the step property is valid value
     */
    _stepChanged() {
      // Cant have a step less than 0
      if(this.step < 0) {
        console.warn("Improper configuration: step cannot be negative. Falling back to absolute value");
        this.set('step', Math.abs(this.step));
        return;
      }

      // Cant have a step of 0
      if(this.step === 0) {
        console.warn("Improper configuration: step cannot be negative. Falling back to 1");
        this.set('step', 1);
        return;
      }
    },

    /**
     * Validates the the min and max values to ensure that the min is < the max
     */
    _minOrMaxChanged() {
        // var min, max;
        //check that min is less than max
        if(this.min === this.max) {
          this.set('_minMaxValid', 0);
          console.warn("Improper configuration: min and max are the same. Increasing max by step size.");
          this.set('max', this.min + this.step);
          return;
        }

        if(this.min > this.max) {
          this.set('_minMaxValid', 0);
          console.warn("Improper configuration: min and max are reversed. Swapping them.");
          var temp = this.min;
          this.set('min', this.max);
          this.set('max', temp);
          return;
        }
        this.setAttribute('aria-valuemin', this.min);
        this.setAttribute('aria-valuemax', this.max);

        // validation passes: trigger set domain
        // apparently, it is possible to run this before polymer property defaults can be applied, so check that _minMaxValid is defined
        this.set('_minMaxValid', (this._minMaxValid || 0) + 1);
    },

    /**
     * Creates a scale which translate pixel coordinates into our data values
     */
    _createScale() {
      this.debounce('_createScale', function() {
        this._createScaleDebounced();
      }, 10);
    },

    /**
     * Creates a scale for realz
     */
    _createScaleDebounced() {
      var scale;

      if(this.scale === 'linear') {
        scale = Px.d3.scaleLinear().clamp(true);
      } else if(this.scale === 'logarithmic') {
        scale = Px.d3.scaleLog().base(this.base).clamp(true);
      } else if(this.scale === 'exponential') {
        scale = Px.d3.scalePow().exponent(this.exponent).clamp(true);
      }

      // TODO Quantize, Ordinal

      this.set('_scale', scale);
    },

    /**
     * Set our scale's range: the pixel max and min to use in the translation
     */
    _setRange() {
      this.debounce('_setRange', function() {
        if(this._scale && this._width && this._height) {
          this._setRangeDebouced();
        }
      }, 10);
    },

    /**
     * Set our scale's range for realz
     */
    _setRangeDebouced() {
      var range;
      if(this.orientation === 'vertical') {
        var h = Math.max(this._height, 0);
        range = [h, 0];

      } else {
        var w = Math.max(this._width, 0);
        range = [0, w];
      }

      this._scale.range(range);

      // force a recalc
      this._scaleChanged = !this._scaleChanged;
    },

    /**
     * Set our scale's domain: the data max and min to use in the translation
     */
    _setDomain() {
      this.debounce('_setDomain', function() {
        if(this._scale && this._minMaxValid) {
          this._setDomainDebounced();
        }
      }, 10);
    },

    /**
     * Set our scale's domain for realz
     */
    _setDomainDebounced() {
      this._scale.domain([this.min, this.max]);

      // force a recalc
      this._scaleChanged = !this._scaleChanged;
    },

    /**
     * Calculate the slider handle value from the mouse position
     */
    _calcSliderValue(mouseVal, valueVar) {
      this.debounce('_calcSliderValue', function() {
        this._calcSliderValueDebounced(mouseVal, valueVar);
      }, 10);
    },

    /**
     * Calculate the slider handle value for realz
     */
    _calcSliderValueDebounced(mouseVal, valueVar) {
      var val = this._scale.invert(mouseVal),  //convert pixel --> value
          stepped = this._calcStepRounded(val),  //round it
          inputElem = valueVar === 'value' ?  this._inputStart : this._inputEnd;  //which input field

      //validate that stepped is not greater than the other handle
      if(this.isRange) {
        stepped = (valueVar === 'value' && stepped > this.endValue) ? this.endValue : stepped;
        stepped = (valueVar === 'endValue' && stepped < this.value) ? this.value : stepped;
      }

      this.toggleClass('validation-error', false, inputElem);
      this.set(valueVar, stepped);
    },

    /**
     * Rounds the raw pixel translated value to one that matches our step size
     */
    _calcStepRounded(value) {
      var s = Math.round(value/this.step) * this.step;

      // make sure it isnt rounding out of our range; should only do so by one step:
      s = s < this.min ? s + this.step : s;
      s = s > this.max ? s - this.step : s;

      return s;
    },

    /**
     * Validate the value
     */
    _validateValue(v, thisVal) {
      var valid = true;
      // check that value <= endValue
      if(this.isRange && thisVal === 'value' && v > this.endValue) {
        v = this.endValue;
        valid = false;
        this.set(thisVal, v);

      // check that endValue <= vale
      } else if(this.isRange && thisVal === 'endValue' && v < this.value) {
        v = this.value;
        valid = false;
        this.set(thisVal, v);
      }

      // check v is greater than the min
      if(v < this.min) {
        v = this._calcStepRounded(this.min);
        valid = false;
        this.set(thisVal, v);

      // check v is less than the max
      } else if(v > this.max) {
        v = this._calcStepRounded(this.max);
        valid = false;
        this.set(thisVal, v);
      }

      return valid;
    },

    /**
     * When the value property changes, sync the handle position
     */
    _valueChanged(v) {
      if(this._startHandle) {
        var valid = this._validateValue(v, 'value');
        if(valid) {
          this._moveHandle(this._startHandle, v);
          this.setAttribute('aria-valuenow',v);
        }
      }
    },

    /**
     * When the endValue property changes, sync the handle position
     */
    _endValueChanged(v) {
      if(v !== null && this._endHandle) {
        var valid = this._validateValue(v, 'endValue');
        if(valid) {
          this._moveHandle(this._endHandle, v);
        }
      }
    },

    /**
     * Apply a transform to the handle to move it
     */
    _moveHandle(handle, v) {
      handle.attr("transform", "translate(" + this._scale(v) + ",0)");
    },

    /**
     * Update the starting point of the progress bar based on the value property and isRange
     */
    _calcProgressStart() {
      if(this.isRange) {
        return this._scale(this.value);
      }
      return 0;
    },

    /**
     * Update the end point of the progress bar based on the value property or endValue property
     */
    _calcProgressEnd() {
      if(this.isRange) {
        return Math.max(this._scale(this.endValue) - this._scale(this.value), 1);
      }

      return this._scale(this.value);
    },

    /**
     * Updates the formating string for nubmer-formatter
     */
    _updateFormat() {
      // if dev passed in a format, just use it
      if(this.format) {
        this.set('_format', this.format);
        return;
      }

      // otherwise figure out if we should have decimals or not
      // TODO Internationalization Comma notation?
      var s = this.step.toString().split('.'),
          l = (s.length === 2) ? s[1].length : 0,
          f = '0.';

      for(var i = 0; i < l; i++) {
        f += '0';
      }

      this.set('_format', f);
    },

    /**
     * User has changed the text in the left input field
     */
    _inputChangedStart(evt) {
      var text = this._inputStart.value;

      this._inputChanged(text, this._inputStart, '#formatterStart', 'value');
    },

    /**
     * User has changed the text in the right input field
     */
    _inputChangedEnd(evt) {
      var text = this._inputEnd.value;

      this._inputChanged(text, this._inputEnd, '#formatterEnd', 'endValue');
    },

    /**
     * When an input field has changed, validates the input and sets the value property
     */
    _inputChanged(text, inputElem, formatterId, valueVar) {
      var formatter = this.$$(formatterId),
          newVal;

      // get a raw number from our input field string
      formatter.set('unformat', text);
      newVal = formatter.unformattedValue;

      if(!newVal && newVal !== 0) {
        // toggle Error state
        this.toggleClass('validation-error', true, inputElem);
        return;
      }

      // make sure our newVal is between our max and min
      // TODO Check with design if this is the appropriate approach: num sets to min or max rather than toggling validation error
      newVal = Math.max(newVal, this.min);
      newVal = Math.min(newVal, this.max);

      // make sure it matches our step
      newVal = this._calcStepRounded(newVal);

      // make sure it is not above/below the other value if range
      if(this.isRange) {
        if((valueVar === 'value' && newVal > this.endValue) ||
           (valueVar === 'endValue' && newVal < this.value)) {

          this.toggleClass('validation-error', true, inputElem);
          return;
        }
      }

      this.toggleClass('validation-error', false, inputElem);
      /*
        in the case that you have a valid number followed by junk, eg, '25kasdjjhasdj'
        the unformatter is smart enough to throw away the chars and just keep the number
        however, this number can be the same as what was already in the box and wont clear from the box
        so reset value to force a recalc to be safe
      */
      this[valueVar] = null;
      this.set(valueVar, newVal);
    },

    /**
     * If the user hits ESC on an input field, reset the display value
     */
    _restoreStartInputValue(evt) {
      this._restoreInputValue(this._inputStart, this.formattedStartValue);
    },

    /**
     * If the user hits ESC on an input field, reset the display value
     */
    _restoreEndInputValue(evt) {
      this._restoreInputValue(this._inputEnd, this.formattedEndValue);
    },

    /**
     * Reset the display value in the input field to the coresponding value property
     */
    _restoreInputValue(input, formattedVal) {
      // must blur for FF to reset value
      input.blur();
      input.value = formattedVal;
      this.toggleClass('validation-error', false, input);
    },

    /**
     * Checks the value of the endValue on initialization to ensure it is valid
     */
    _checkEndValue() {
      var v = this._calcStepRounded(this.endValue);
      if(v >= this.value && v <= this.max) {
        this.set('endValue', v);
      } else {
        var m = this._calcStepRounded(this.max);
        this.set('endValue', m);
      }
    },

    /**
     * Fired when isRange changes value to turn the slider into a range slider or single slider
     */
    _isRangeChanged() {
      // make sure the endValue is valid
      this._checkEndValue();

      // check if we need to change inputs shown
      this._hideInputsChanged();

      // rebuild the handles
      this._buildHandles();
    },

    /**
     * Sets disabled  styles
     */
    _toggleDisabledClass() {
      this._startHandle.classed('disabled', this.disabled);
      this._endHandle.classed('disabled', this.disabled);
    },

    /**
     * Sets disabled  styles
     */
    _returnLabel(label, showLabels) {
      return showLabels ? label : "";
    },

    _returnLabelPosition(labelPosition) {
      return labelPosition === 'top' ? -15 : 18;
    },

    _returnLabelBaseline(labelPosition) {
      return labelPosition === 'top' ? "baseline" : "hanging";
    }
  });
})();
