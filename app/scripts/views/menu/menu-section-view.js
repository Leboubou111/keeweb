'use strict';

var Backbone = require('backbone'),
    MenuItemView = require('./menu-item-view'),
    Resizable = require('../../mixins/resizable'),
    Scrollable = require('../../mixins/scrollable'),
    baron = require('baron');

var MenuSectionView = Backbone.View.extend({
    template: require('templates/menu/menu-section.html'),

    events: {},

    itemViews: null,

    minHeight: 55,
    maxHeight: function() { return this.$el.parent().height() - 116; },
    autoHeight: 'auto',

    initialize: function () {
        this.itemViews = [];
        this.listenTo(this.model, 'change-items', this.itemsChanged);
    },

    render: function() {
        if (!this.itemsEl) {
            this.renderTemplate(this.model.attributes);
            this.itemsEl = this.model.get('scrollable') ? this.$el.find('.scroller') : this.$el;
            if (this.model.get('scrollable')) {
                this.initScroll();
                this.scroll = baron({
                    root: this.$el[0],
                    scroller: this.$el.find('.scroller')[0],
                    bar: this.$el.find('.scroller__bar')[0],
                    $: Backbone.$
                });
                this.scrollerBar = this.$el.find('.scroller__bar');
                this.scrollerBarWrapper = this.$el.find('.scroller__bar-wrapper');
            }
        } else {
            this.removeInnerViews();
        }
        this.model.get('items').forEach(function(item) {
            var itemView = new MenuItemView({ el: this.itemsEl, model: item });
            itemView.render();
            this.itemViews.push(itemView);
        }, this);
        if (this.model.get('scrollable')) {
            this.pageResized();
        }
    },

    remove : function() {
        if (this.scroll) {
            this.scroll.dispose();
        }
        this.removeInnerViews();
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    removeInnerViews: function() {
        this.itemViews.forEach(function(itemView) { itemView.remove(); });
        this.itemViews = [];
    },

    itemsChanged: function() {
        this.render();
    }
});

_.extend(MenuSectionView.prototype, Resizable);
_.extend(MenuSectionView.prototype, Scrollable);

module.exports = MenuSectionView;