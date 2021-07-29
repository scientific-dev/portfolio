
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.41.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const SVGS = {
        GitHub: 'fab fa-github',
        NPM: 'fab fa-npm',
        Docs: 'fas fa-book',
        Link: 'fas fa-link',
        Deno: 'fas fa-archive'
    };

    function makeBtn(href, name){
        return { name, href, svg: SVGS[name] };
    }

    var Projects = [
        {
            name: 'Spotify-api.js',
            description: 'A npm package to interact with spotify api with node.js with oauth support. This package also supports caching!',
            languages: ['Typescript', 'Javascript'],
            link: 'https://npmjs.com/package/spotify-api.js',
            buttons: [
                makeBtn('https://github.com/spotify-api/spotify-api.js', 'GitHub'),
                makeBtn('https://npmjs.com/package/spotify-api.js', 'NPM'),
                makeBtn('https://spotify-api.js.org', 'Docs')
            ]
        },
        {
            name: 'Enhanced.db',
            description: 'A npm package which is a wrapper for better-sqlite3! Currently not maintained...',
            languages: ['Javascript'],
            link: 'https://npmjs.com/package/enhanced.db',
            buttons: [
                makeBtn('https://github.com/Scientific-Guy/enhanced.db', 'GitHub'),
                makeBtn('https://npmjs.com/package/enhanced.db', 'Link')
            ]
        },
        {
            name: 'Instant.db',
            description: 'Instant.db helps you to make database instantly using json files for Node.js!',
            languages: ['React', 'Next.js', 'Javascript'],
            link: 'https://npmjs.com/package/instant.db',
            buttons: [
                makeBtn('https://github.com/Scientific-Guy/instant.db', 'GitHub'),
                makeBtn('https://npmjs.com/package/instant.db', 'Link')
            ]
        },
        {
            name: 'Listcord',
            description: 'Listcord is a discord botlist with a clean environment with many features with 100+ bots!',
            languages: ['React', 'Next.js', 'Javascript'],
            link: 'https://listcord.gg',
            buttons: [
                makeBtn('https://listcord.gg', 'Link')
            ]
        },
        {
            name: 'Templatify',
            description: 'A cli to create local templates and copy templates from github which is saved within your pc and used easily!',
            languages: ['Go'],
            link: 'https://github.com/Scientific-Guy/templatify',
            buttons: [
                makeBtn('https://github.com/Scientific-Guy/templatify', 'GitHub')
            ]
        },
        {
            name: 'EvtManager',
            description: 'Simple to use eventemitter to manage your events synchronously and asynchronously too for Deno, Node and browser with a typesafe environment!',
            link: 'https://github.com/scientific-guy/evtmanager',
            languages: ['Javascript', 'Typescript'],
            buttons: [
                makeBtn('https://npmjs.com/package/evtmanager', 'NPM'),
                makeBtn('https://deno.land/x/evtmanager', 'Deno'),
                makeBtn('https://github.com/scientific-guy/evtmanager', 'GitHub')
            ]
        },
        {
            name: 'Emoji Canvas',
            description: 'An easy to use module to write text with parsed emojis (supports discord emojis too) in canvas for deno!',
            languages: ['Javascript', 'Typescript'],
            link: 'https://github.com/Scientific-Guy/emoji-canvas',
            buttons: [
                makeBtn('deno.land/x/emoji_canvas', 'Deno'),
                makeBtn('https://github.com/Scientific-Guy/emoji-canvas', 'GitHub')
            ]
        },
        {
            name: 'Deno Headers Socket',
            description: 'A custom socket for deno to add custom headers which lacks in the standard library!',
            link: 'https://github.com/scientific-guy/custom-socket',
            languages: ['Javascript', 'Typescript'],
            buttons: [
                makeBtn('https://deno.land/x/custom_socket', 'Deno'),
                makeBtn('https://github.com/scientific-guy/custom-socket')
            ]
        }
    ];

    /* src\App.svelte generated by Svelte v3.41.0 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (129:2) {#each SOCIAL_LINKS as link}
    function create_each_block_4(ctx) {
    	let a;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t = space();
    			attr_dev(i, "class", `fab fa-${/*link*/ ctx[24].name}`);
    			add_location(i, file, 130, 4, 5169);
    			attr_dev(a, "style", `background-color: #${/*link*/ ctx[24].color};`);
    			attr_dev(a, "class", `socialcard social-${/*link*/ ctx[24].name}`);
    			attr_dev(a, "href", /*link*/ ctx[24].url);
    			add_location(a, file, 129, 6, 5060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(129:2) {#each SOCIAL_LINKS as link}",
    		ctx
    	});

    	return block;
    }

    // (160:3) {#each DEVICONS as icon}
    function create_each_block_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = `https://raw.githubusercontent.com/devicons/devicon/master/icons/${/*icon*/ ctx[21].split('-')[0]}/${/*icon*/ ctx[21]}.svg`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*icon*/ ctx[21].split('-')[0]);
    			attr_dev(img, "draggable", "false");
    			set_style(img, "cursor", "pointer");
    			attr_dev(img, "class", "diminished-devicon");
    			add_location(img, file, 160, 7, 6245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(160:3) {#each DEVICONS as icon}",
    		ctx
    	});

    	return block;
    }

    // (175:7) {#each project.buttons as button}
    function create_each_block_2(ctx) {
    	let a;
    	let i;
    	let i_class_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = /*button*/ ctx[18].svg);
    			add_location(i, file, 175, 33, 7089);
    			attr_dev(a, "href", a_href_value = /*button*/ ctx[18].href);
    			add_location(a, file, 175, 11, 7067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projects*/ 1 && i_class_value !== (i_class_value = /*button*/ ctx[18].svg)) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*projects*/ 1 && a_href_value !== (a_href_value = /*button*/ ctx[18].href)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(175:7) {#each project.buttons as button}",
    		ctx
    	});

    	return block;
    }

    // (185:6) {#each project.languages as language}
    function create_each_block_1(ctx) {
    	let p;
    	let t_value = /*language*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "lang");
    			add_location(p, file, 185, 13, 7447);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projects*/ 1 && t_value !== (t_value = /*language*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(185:6) {#each project.languages as language}",
    		ctx
    	});

    	return block;
    }

    // (169:3) {#each projects as project}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let i0;
    	let t0;
    	let span0;
    	let a;
    	let i1;
    	let a_href_value;
    	let t1;
    	let t2;
    	let h2;
    	let t3_value = /*project*/ ctx[12].name + "";
    	let t3;
    	let t4;
    	let p;
    	let t5_value = /*project*/ ctx[12].description + "";
    	let t5;
    	let t6;
    	let span1;
    	let t7;
    	let each_value_2 = /*project*/ ctx[12].buttons;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*project*/ ctx[12].languages;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			a = element("a");
    			i1 = element("i");
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			h2 = element("h2");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			span1 = element("span");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			attr_dev(i0, "class", "far fa-folder-open fa-2x");
    			add_location(i0, file, 171, 24, 6831);
    			attr_dev(i1, "class", "fas fa-external-link-alt");
    			add_location(i1, file, 173, 51, 6973);
    			attr_dev(a, "href", a_href_value = /*project*/ ctx[12].link);
    			add_location(a, file, 173, 28, 6950);
    			set_style(span0, "float", "right");
    			add_location(span0, file, 172, 24, 6893);
    			attr_dev(div0, "class", "svg-row");
    			add_location(div0, file, 170, 20, 6785);
    			add_location(h2, file, 180, 20, 7212);
    			attr_dev(p, "class", "description");
    			add_location(p, file, 181, 20, 7256);
    			set_style(span1, "display", "inline-block");
    			set_style(span1, "margin-left", "-2px");
    			set_style(span1, "margin-bottom", "-10px");
    			add_location(span1, file, 183, 5, 7311);
    			attr_dev(div1, "class", "project-card opacity-0");
    			add_location(div1, file, 169, 7, 6728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, i0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, a);
    			append_dev(a, i1);
    			append_dev(span0, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(span0, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			append_dev(div1, t6);
    			append_dev(div1, span1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(span1, null);
    			}

    			append_dev(div1, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projects*/ 1 && a_href_value !== (a_href_value = /*project*/ ctx[12].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*projects*/ 1) {
    				each_value_2 = /*project*/ ctx[12].buttons;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(span0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*projects*/ 1 && t3_value !== (t3_value = /*project*/ ctx[12].name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*projects*/ 1 && t5_value !== (t5_value = /*project*/ ctx[12].description + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*projects*/ 1) {
    				each_value_1 = /*project*/ ctx[12].languages;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(span1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(169:3) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let span0;
    	let h2;
    	let t2;
    	let span1;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let button2;
    	let div1_class_value;
    	let t8;
    	let div4;
    	let div2;
    	let h1;
    	let t10;
    	let p0;
    	let t11;
    	let t12;
    	let p1;
    	let t14;
    	let div3;
    	let t15;
    	let div14;
    	let div9;
    	let span3;
    	let span2;
    	let t17;
    	let t18;
    	let div8;
    	let div6;
    	let div5;
    	let img0;
    	let img0_src_value;
    	let t19;
    	let div7;
    	let span4;
    	let t21;
    	let br0;
    	let t22;
    	let span5;
    	let t24;
    	let br1;
    	let t25;
    	let span6;
    	let t27;
    	let br2;
    	let t28;
    	let span7;
    	let t30;
    	let img1;
    	let img1_src_value;
    	let t31;
    	let br3;
    	let t32;
    	let span8;
    	let t34;
    	let br4;
    	let br5;
    	let t35;
    	let p2;
    	let t36;
    	let div11;
    	let span10;
    	let span9;
    	let t38;
    	let t39;
    	let div10;
    	let t40;
    	let div13;
    	let span12;
    	let span11;
    	let t42;
    	let t43;
    	let div12;
    	let t44;
    	let p3;
    	let t45;
    	let t46_value = (/*projects*/ ctx[0].length <= 6 ? 'more' : 'less') + "";
    	let t46;
    	let t47;
    	let t48;
    	let div15;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*SOCIAL_LINKS*/ ctx[4];
    	validate_each_argument(each_value_4);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_2[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*DEVICONS*/ ctx[3];
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			h2 = element("h2");
    			h2.textContent = "Scientific Guy";
    			t2 = space();
    			span1 = element("span");
    			button0 = element("button");
    			button0.textContent = "Home";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "About";
    			t6 = space();
    			button2 = element("button");
    			button2.textContent = "Projects";
    			t8 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Scientific Guy";
    			t10 = space();
    			p0 = element("p");
    			t11 = text(/*title*/ ctx[1]);
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "I am a high school student who likes to do programming and stuff. I am a full stack developer and I mostly build user interfaces with the prominent programming language as Javascript.";
    			t14 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t15 = space();
    			div14 = element("div");
    			div9 = element("div");
    			span3 = element("span");
    			span2 = element("span");
    			span2.textContent = "01.";
    			t17 = text(" About me");
    			t18 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			img0 = element("img");
    			t19 = space();
    			div7 = element("div");
    			span4 = element("span");
    			span4.textContent = "Name:";
    			t21 = text(" Scientific Guy (Not real name though)");
    			br0 = element("br");
    			t22 = space();
    			span5 = element("span");
    			span5.textContent = "Mail:";
    			t24 = text(" scientificguy007@gmail.com");
    			br1 = element("br");
    			t25 = space();
    			span6 = element("span");
    			span6.textContent = "Aka:";
    			t27 = text(" NO U, Science Spot");
    			br2 = element("br");
    			t28 = space();
    			span7 = element("span");
    			span7.textContent = "Location:";
    			t30 = space();
    			img1 = element("img");
    			t31 = text(" India");
    			br3 = element("br");
    			t32 = space();
    			span8 = element("span");
    			span8.textContent = "Favourite Languages:";
    			t34 = text(" Javascript, Rust and Golang");
    			br4 = element("br");
    			br5 = element("br");
    			t35 = space();
    			p2 = element("p");
    			t36 = space();
    			div11 = element("div");
    			span10 = element("span");
    			span9 = element("span");
    			span9.textContent = "02.";
    			t38 = text(" What do i know?");
    			t39 = space();
    			div10 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t40 = space();
    			div13 = element("div");
    			span12 = element("span");
    			span11 = element("span");
    			span11.textContent = "03.";
    			t42 = text(" Projects");
    			t43 = space();
    			div12 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t44 = space();
    			p3 = element("p");
    			t45 = text("Show ");
    			t46 = text(t46_value);
    			t47 = text(" projects?");
    			t48 = space();
    			div15 = element("div");
    			div15.textContent = "© Scientific-Guy 2021";
    			attr_dev(div0, "class", "background");
    			add_location(div0, file, 109, 0, 4265);
    			add_location(h2, file, 112, 38, 4401);
    			set_style(span0, "display", "inline-block");
    			add_location(span0, file, 112, 1, 4364);
    			add_location(button0, file, 114, 2, 4458);
    			add_location(button1, file, 115, 2, 4548);
    			add_location(button2, file, 116, 2, 4618);
    			attr_dev(span1, "class", "buttons");
    			add_location(span1, file, 113, 1, 4433);
    			attr_dev(div1, "class", div1_class_value = `header ${/*scrolledHeader*/ ctx[2] ? 'scrolled-header' : ''}`);
    			add_location(div1, file, 111, 0, 4297);
    			add_location(h1, file, 122, 2, 4753);
    			add_location(p0, file, 123, 2, 4779);
    			add_location(p1, file, 124, 2, 4796);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 121, 1, 4729);
    			attr_dev(div3, "class", "socialcards");
    			add_location(div3, file, 127, 1, 4997);
    			attr_dev(div4, "class", "cover");
    			add_location(div4, file, 120, 0, 4708);
    			add_location(span2, file, 138, 36, 5340);
    			attr_dev(span3, "class", "section-title");
    			add_location(span3, file, 138, 8, 5312);
    			attr_dev(img0, "class", "pfp");
    			if (!src_url_equal(img0.src, img0_src_value = "/branding96.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Scientific Guy");
    			add_location(img0, file, 141, 9, 5429);
    			add_location(div5, file, 141, 4, 5424);
    			add_location(div6, file, 140, 3, 5414);
    			add_location(span4, file, 145, 4, 5520);
    			add_location(br0, file, 145, 61, 5577);
    			add_location(span5, file, 146, 4, 5587);
    			add_location(br1, file, 146, 50, 5633);
    			add_location(span6, file, 147, 4, 5643);
    			add_location(br2, file, 147, 41, 5680);
    			add_location(span7, file, 148, 4, 5690);
    			attr_dev(img1, "class", "in-flag");
    			if (!src_url_equal(img1.src, img1_src_value = "https://lipis.github.io/flag-icon-css/flags/4x3/in.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Indian Flag");
    			add_location(img1, file, 148, 28, 5714);
    			add_location(br3, file, 148, 134, 5820);
    			add_location(span8, file, 149, 4, 5830);
    			add_location(br4, file, 149, 66, 5892);
    			add_location(br5, file, 149, 71, 5897);
    			attr_dev(p2, "id", "abt-content");
    			set_style(p2, "display", "inline-block");
    			set_style(p2, "margin", "0");
    			add_location(p2, file, 151, 4, 5908);
    			add_location(div7, file, 144, 3, 5510);
    			attr_dev(div8, "class", "section-content");
    			add_location(div8, file, 139, 8, 5381);
    			attr_dev(div9, "class", "section abt-me");
    			attr_dev(div9, "id", "abt-me");
    			add_location(div9, file, 137, 1, 5263);
    			add_location(span9, file, 157, 36, 6106);
    			attr_dev(span10, "class", "section-title");
    			add_location(span10, file, 157, 8, 6078);
    			attr_dev(div10, "class", "section-content");
    			set_style(div10, "margin-top", "10px");
    			add_location(div10, file, 158, 8, 6154);
    			attr_dev(div11, "class", "section wdik");
    			set_style(div11, "margin-top", "20px");
    			attr_dev(div11, "id", "wdik");
    			add_location(div11, file, 156, 1, 6007);
    			add_location(span11, file, 166, 36, 6593);
    			attr_dev(span12, "class", "section-title");
    			add_location(span12, file, 166, 8, 6565);
    			attr_dev(div12, "class", "section-content");
    			set_style(div12, "margin-top", "10px");
    			add_location(div12, file, 167, 8, 6634);
    			set_style(p3, "font-family", "Changa");
    			set_style(p3, "color", "white");
    			set_style(p3, "font-size", "18px");
    			set_style(p3, "cursor", "pointer");
    			add_location(p3, file, 192, 2, 7554);
    			attr_dev(div13, "class", "section projects");
    			set_style(div13, "margin-top", "20px");
    			attr_dev(div13, "id", "projects");
    			add_location(div13, file, 165, 1, 6486);
    			attr_dev(div14, "class", "rest-body");
    			add_location(div14, file, 136, 0, 5238);
    			attr_dev(div15, "class", "footer");
    			add_location(div15, file, 201, 0, 7822);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(span0, h2);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, button0);
    			append_dev(span1, t4);
    			append_dev(span1, button1);
    			append_dev(span1, t6);
    			append_dev(span1, button2);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t10);
    			append_dev(div2, p0);
    			append_dev(p0, t11);
    			append_dev(div2, t12);
    			append_dev(div2, p1);
    			append_dev(div4, t14);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div3, null);
    			}

    			insert_dev(target, t15, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, div9);
    			append_dev(div9, span3);
    			append_dev(span3, span2);
    			append_dev(span3, t17);
    			append_dev(div9, t18);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img0);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, span4);
    			append_dev(div7, t21);
    			append_dev(div7, br0);
    			append_dev(div7, t22);
    			append_dev(div7, span5);
    			append_dev(div7, t24);
    			append_dev(div7, br1);
    			append_dev(div7, t25);
    			append_dev(div7, span6);
    			append_dev(div7, t27);
    			append_dev(div7, br2);
    			append_dev(div7, t28);
    			append_dev(div7, span7);
    			append_dev(div7, t30);
    			append_dev(div7, img1);
    			append_dev(div7, t31);
    			append_dev(div7, br3);
    			append_dev(div7, t32);
    			append_dev(div7, span8);
    			append_dev(div7, t34);
    			append_dev(div7, br4);
    			append_dev(div7, br5);
    			append_dev(div7, t35);
    			append_dev(div7, p2);
    			append_dev(div14, t36);
    			append_dev(div14, div11);
    			append_dev(div11, span10);
    			append_dev(span10, span9);
    			append_dev(span10, t38);
    			append_dev(div11, t39);
    			append_dev(div11, div10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div10, null);
    			}

    			append_dev(div14, t40);
    			append_dev(div14, div13);
    			append_dev(div13, span12);
    			append_dev(span12, span11);
    			append_dev(span12, t42);
    			append_dev(div13, t43);
    			append_dev(div13, div12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div12, null);
    			}

    			append_dev(div13, t44);
    			append_dev(div13, p3);
    			append_dev(p3, t45);
    			append_dev(p3, t46);
    			append_dev(p3, t47);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, div15, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", scrollNavigationHandler('abt-me'), false, false, false),
    					listen_dev(button2, "click", scrollNavigationHandler('projects'), false, false, false),
    					listen_dev(p3, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scrolledHeader*/ 4 && div1_class_value !== (div1_class_value = `header ${/*scrolledHeader*/ ctx[2] ? 'scrolled-header' : ''}`)) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t11, /*title*/ ctx[1]);

    			if (dirty & /*SOCIAL_LINKS*/ 16) {
    				each_value_4 = /*SOCIAL_LINKS*/ ctx[4];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_4(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_4.length;
    			}

    			if (dirty & /*DEVICONS*/ 8) {
    				each_value_3 = /*DEVICONS*/ ctx[3];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div10, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div12, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*projects*/ 1 && t46_value !== (t46_value = (/*projects*/ ctx[0].length <= 6 ? 'more' : 'less') + "")) set_data_dev(t46, t46_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div14);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(div15);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ABOUT_ME_CONTENT = 'I started programming and making web apps in 2018 with python then learnt Node.js and Typescript then slowly started learning web frameworks such as React, Next.js, Svelte and then programming languages such as Rust, Golang, etc!\nI love making web apps so i always work on web application projects! I rarely make softwares and mobile apps. I animate and draw when i am at the peak of my boredom.';

    function scrollNavigationHandler(id) {
    	return () => {
    		let top = document.getElementById(id).getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    		window.scrollTo({ top, behavior: 'smooth' });
    	};
    }

    function sleep(ms) {
    	return new Promise(r => setTimeout(r, ms));
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const TITLES = ['A Developer', 'An Animator', ' A Youtuber'];

    	const DEVICONS = [
    		'rust-plain',
    		'go-original',
    		'javascript-plain',
    		'python-original',
    		'html5-original',
    		'css3-original',
    		'bash-original'
    	];

    	const SOCIAL_LINKS = [
    		{
    			name: 'youtube',
    			url: 'https://www.youtube.com/channel/UCu6B4Z62fiCT_mwwHlc84iQ',
    			color: 'ff0000'
    		},
    		{
    			name: 'github',
    			url: 'https://github.com/Scientific-Guy',
    			color: '211f1f'
    		},
    		{
    			name: 'twitter',
    			url: 'https://twitter.com/ScientificDev',
    			color: '1da1f2'
    		},
    		{
    			name: 'discord',
    			url: 'https://discord.gg/FrduEZd',
    			color: '7298da'
    		}
    	];

    	let projects = Projects.slice(0, 6);
    	let title = 'A Developer';
    	let scrolledHeader = false;

    	let elementState = {
    		projectCards: [],
    		aboutContentViewed: false,
    		wdikContentViewed: false
    	};

    	afterUpdate(() => {
    		elementState.projectCards = document.querySelectorAll('.opacity-0');
    		checkProjectCardAnimation();
    	});

    	function checkProjectCardAnimation() {
    		for (var i = 0; i < elementState.projectCards.length; i++) {
    			var element = elementState.projectCards[i];
    			var { top, bottom } = element.getBoundingClientRect();
    			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) element.classList.remove('opacity-0');
    		}
    	}

    	async function checkAboutContentAnimation() {
    		if (!elementState.aboutContentViewed) {
    			var aboutContentElement = document.getElementById('abt-content');
    			var { top, bottom } = aboutContentElement.getBoundingClientRect();

    			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) {
    				elementState.aboutContentViewed = true;

    				const write = async content => {
    					let characters = content.split('');

    					for (let i = 0; i < characters.length; i++) {
    						await sleep(50);
    						aboutContentElement.innerHTML += characters[i];
    					}
    				};

    				await write(ABOUT_ME_CONTENT);
    				aboutContentElement.innerHTML += '<br/><br/><span>Warning: </span>';
    				await write('The avatar which is been used here is made by me so kindly contact me before using it.');
    			}
    		}
    	}

    	async function checkWDIKContentAnimation() {
    		if (!elementState.wdikContentViewed) {
    			var wdikContentElement = document.getElementById('wdik');
    			var { top, bottom } = wdikContentElement.getBoundingClientRect();

    			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) {
    				elementState.wdikContentViewed = true;
    				var deviconElements = document.querySelectorAll('.wdik img');

    				for (let i = 0; i < deviconElements.length; i++) {
    					await sleep(250);
    					deviconElements[i].classList.remove('diminished-devicon');
    				}
    			}
    		}
    	}

    	window.addEventListener('load', () => {
    		const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    		$$invalidate(2, scrolledHeader = scrolled > 20);
    	});

    	window.addEventListener('resize', () => {
    		elementState.projectCards = document.querySelectorAll('.project-card');
    		checkProjectCardAnimation();
    		checkAboutContentAnimation();
    		checkWDIKContentAnimation();
    	});

    	window.addEventListener('scroll', () => {
    		const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    		$$invalidate(2, scrolledHeader = scrolled > 20);
    		checkProjectCardAnimation();
    		checkAboutContentAnimation();
    		checkWDIKContentAnimation();
    	});

    	setInterval(() => $$invalidate(1, title = TITLES[Math.floor(Math.random() * TITLES.length)]), 50000);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => window.scrollTo({ top: 0, behaviour: 'smooth' });
    	const click_handler_1 = () => $$invalidate(0, projects = projects.length <= 6 ? Projects : Projects.slice(0, 6));

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		Projects,
    		ABOUT_ME_CONTENT,
    		TITLES,
    		DEVICONS,
    		SOCIAL_LINKS,
    		projects,
    		title,
    		scrolledHeader,
    		elementState,
    		scrollNavigationHandler,
    		sleep,
    		checkProjectCardAnimation,
    		checkAboutContentAnimation,
    		checkWDIKContentAnimation
    	});

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate(0, projects = $$props.projects);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('scrolledHeader' in $$props) $$invalidate(2, scrolledHeader = $$props.scrolledHeader);
    		if ('elementState' in $$props) elementState = $$props.elementState;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		projects,
    		title,
    		scrolledHeader,
    		DEVICONS,
    		SOCIAL_LINKS,
    		click_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var main = new App({ target: document.body });

    return main;

}());
//# sourceMappingURL=bundle.js.map
