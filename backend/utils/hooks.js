/**
 * WordPress-style Actions and Filters Hook Engine
 * Provides dynamic event registers for extending platform behavior.
 */

class HookRegistry {
    constructor() {
        this.actions = {};
        this.filters = {};
    }

    /**
     * Register an action callback.
     * @param {string} hook - Hook name
     * @param {Function} callback - Callback function
     * @param {number} priority - Execution order (lower runs first)
     */
    addAction(hook, callback, priority = 10) {
        if (typeof callback !== 'function') {
            console.error(`addAction error: Callback for hook "${hook}" is not a function.`);
            return;
        }
        if (!this.actions[hook]) {
            this.actions[hook] = [];
        }
        this.actions[hook].push({ callback, priority });
        this.actions[hook].sort((a, b) => a.priority - b.priority);
    }

    /**
     * Execute actions registered on a hook.
     * @param {string} hook - Hook name
     * @param {...any} args - Arguments passed to callbacks
     */
    doAction(hook, ...args) {
        if (!this.actions[hook]) return;
        
        for (const item of this.actions[hook]) {
            try {
                item.callback(...args);
            } catch (err) {
                console.error(`Error in action callback for hook "${hook}":`, err.message);
            }
        }
    }

    /**
     * Register a filter callback.
     * @param {string} hook - Hook name
     * @param {Function} callback - Callback function (must return a value)
     * @param {number} priority - Execution order (lower runs first)
     */
    addFilter(hook, callback, priority = 10) {
        if (typeof callback !== 'function') {
            console.error(`addFilter error: Callback for hook "${hook}" is not a function.`);
            return;
        }
        if (!this.filters[hook]) {
            this.filters[hook] = [];
        }
        this.filters[hook].push({ callback, priority });
        this.filters[hook].sort((a, b) => a.priority - b.priority);
    }

    /**
     * Apply filter callbacks sequentially to a value.
     * @param {string} hook - Hook name
     * @param {any} value - Initial value to filter
     * @param {...any} args - Additional arguments passed to filters
     * @returns {any} Filtered value
     */
    applyFilters(hook, value, ...args) {
        if (!this.filters[hook]) return value;

        let filteredValue = value;
        for (const item of this.filters[hook]) {
            try {
                filteredValue = item.callback(filteredValue, ...args);
            } catch (err) {
                console.error(`Error in filter callback for hook "${hook}":`, err.message);
            }
        }
        return filteredValue;
    }

    /**
     * Remove a callback from an action hook.
     */
    removeAction(hook, callback) {
        if (!this.actions[hook]) return;
        this.actions[hook] = this.actions[hook].filter(item => item.callback !== callback);
    }

    /**
     * Remove a callback from a filter hook.
     */
    removeFilter(hook, callback) {
        if (!this.filters[hook]) return;
        this.filters[hook] = this.filters[hook].filter(item => item.callback !== callback);
    }
}

// Export single instances
const hooks = new HookRegistry();

module.exports = hooks;
