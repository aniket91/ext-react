"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidateOptions = getValidateOptions;
exports.getDefaultOptions = getDefaultOptions;
exports.getDefaultVars = getDefaultVars;
exports.extractFromSource = extractFromSource;

function getValidateOptions() {
  return {
    "type": "object",
    "properties": {
      "framework": {
        "type": ["string"]
      },
      "port": {
        "type": ["integer"]
      },
      "emit": {
        "type": ["boolean"]
      },
      "browser": {
        "type": ["boolean"]
      },
      "extRoot": {
        "type": ["string"]
      },
      "extFolder": {
        "type": ["string"]
      },
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "type": ["string"]
      },
      "verbose": {
        "type": ["string"]
      },
      "theme": {
        "type": ["string"]
      },
      "toolkit": {
        "type": ["string"]
      },
      "packages": {
        "type": ["string", "array"]
      }
    },
    "additionalProperties": false // "errorMessage": {
    //   "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
    // }

  };
}

function getDefaultOptions() {
  return {
    port: 1962,
    emit: true,
    browser: true,
    extRoot: 'ext',
    extFolder: '../../node_modules/@sencha',
    profile: '',
    environment: 'development',
    verbose: 'no',
    toolkit: 'modern',
    packages: null
  };
}

function getDefaultVars() {
  return {
    firstTime: true,
    firstCompile: true,
    browserCount: 0,
    manifest: null,
    extPath: 'ext-angular',
    pluginErrors: [],
    deps: [],
    rebuild: true
  };
}

function toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-');
}

function extractFromSource(js) {
  var generate = require("@babel/generator").default;

  var parse = require("babylon").parse;

  var traverse = require("ast-traverse");

  const statements = [];
  return statements; //temporary until angular parse is written

  const ast = parse(js, {
    plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport'],
    sourceType: 'module'
  });

  function addType(argNode) {
    var type;

    if (argNode.type === 'StringLiteral') {
      var xtype = toXtype(argNode.value);

      if (xtype != 'extreact') {
        type = {
          xtype: toXtype(argNode.value)
        };
      }
    } else {
      type = {
        xclass: js.slice(argNode.start, argNode.end)
      };
    }

    if (type != undefined) {
      let config = JSON.stringify(type);
      statements.push(`Ext.create(${config})`);
    }
  }

  traverse(ast, {
    pre: function (node) {
      if (node.type === 'CallExpression' && node.callee && node.callee.object && node.callee.object.name === 'Ext') {
        statements.push(generate(node).code);
      }

      if (node.type == 'VariableDeclarator' && node.init && node.init.type === 'CallExpression' && node.init.callee) {
        if (node.init.callee.name == 'reactify') {
          for (let i = 0; i < node.init.arguments.length; i++) {
            const valueNode = node.init.arguments[i];
            if (!valueNode) continue;
            addType(valueNode);
          }
        }
      } // // Convert React.createElement(...) calls to the equivalent Ext.create(...) calls to put in the manifest.
      // if (node.type === 'CallExpressionx' 
      //     && node.callee.object 
      //     && node.callee.object.name === 'React' 
      //     && node.callee.property.name === 'createElement') {
      //   const [props] = node.arguments
      //   let config
      //   if (Array.isArray(props.properties)) {
      //     config = generate(props).code
      //     for (let key in type) {
      //       config = `{\n  ${key}: '${type[key]}',${config.slice(1)}`
      //     }
      //   } else {
      //     config = JSON.stringify(type)
      //   }
      // }

    }
  });
  return statements;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmd1bGFyVXRpbC5qcyJdLCJuYW1lcyI6WyJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJnZXREZWZhdWx0T3B0aW9ucyIsInBvcnQiLCJlbWl0IiwiYnJvd3NlciIsImV4dFJvb3QiLCJleHRGb2xkZXIiLCJwcm9maWxlIiwiZW52aXJvbm1lbnQiLCJ2ZXJib3NlIiwidG9vbGtpdCIsInBhY2thZ2VzIiwiZ2V0RGVmYXVsdFZhcnMiLCJmaXJzdFRpbWUiLCJmaXJzdENvbXBpbGUiLCJicm93c2VyQ291bnQiLCJtYW5pZmVzdCIsImV4dFBhdGgiLCJwbHVnaW5FcnJvcnMiLCJkZXBzIiwicmVidWlsZCIsInRvWHR5cGUiLCJzdHIiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJleHRyYWN0RnJvbVNvdXJjZSIsImpzIiwiZ2VuZXJhdGUiLCJyZXF1aXJlIiwiZGVmYXVsdCIsInBhcnNlIiwidHJhdmVyc2UiLCJzdGF0ZW1lbnRzIiwiYXN0IiwicGx1Z2lucyIsInNvdXJjZVR5cGUiLCJhZGRUeXBlIiwiYXJnTm9kZSIsInR5cGUiLCJ4dHlwZSIsInZhbHVlIiwieGNsYXNzIiwic2xpY2UiLCJzdGFydCIsImVuZCIsInVuZGVmaW5lZCIsImNvbmZpZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJwdXNoIiwicHJlIiwibm9kZSIsImNhbGxlZSIsIm9iamVjdCIsIm5hbWUiLCJjb2RlIiwiaW5pdCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ2YWx1ZU5vZGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRU8sU0FBU0Esa0JBQVQsR0FBOEI7QUFDbkMsU0FBTztBQUNMLFlBQVEsUUFESDtBQUVMLGtCQUFjO0FBQ1osbUJBQWU7QUFBQyxnQkFBUSxDQUFFLFFBQUY7QUFBVCxPQURIO0FBRVosY0FBZTtBQUFDLGdCQUFRLENBQUUsU0FBRjtBQUFULE9BRkg7QUFHWixjQUFlO0FBQUMsZ0JBQVEsQ0FBRSxTQUFGO0FBQVQsT0FISDtBQUlaLGlCQUFl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LENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdOLElBQUksQ0FBQ0ssSUFBTCxDQUFVRSxTQUFWLENBQW9CQyxNQUF4QyxFQUFnREYsQ0FBQyxFQUFqRCxFQUFxRDtBQUNuRCxrQkFBTUcsU0FBUyxHQUFHVCxJQUFJLENBQUNLLElBQUwsQ0FBVUUsU0FBVixDQUFvQkQsQ0FBcEIsQ0FBbEI7QUFDQSxnQkFBSSxDQUFDRyxTQUFMLEVBQWdCO0FBQ2hCeEIsWUFBQUEsT0FBTyxDQUFDd0IsU0FBRCxDQUFQO0FBQ0Q7QUFDRDtBQUNILE9BcEJpQixDQXNCbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0Q7QUF2Q1csR0FBTixDQUFSO0FBeUNBLFNBQU81QixVQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJwb3J0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJpbnRlZ2VyXCIgXX0sXG4gICAgICBcImVtaXRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfSxcbiAgICAgIFwiYnJvd3NlclwiOiAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJleHRSb290XCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwiZXh0Rm9sZGVyXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInByb2ZpbGVcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidmVyYm9zZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInRoZW1lXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0b29sa2l0XCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwicGFja2FnZXNcIjogICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIsIFwiYXJyYXlcIiBdfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICAgIC8vIFwiZXJyb3JNZXNzYWdlXCI6IHtcbiAgICAvLyAgIFwib3B0aW9uXCI6IFwic2hvdWxkIGJlIHtCb29sZWFufSAoaHR0cHM6L2dpdGh1Yi5jb20vb3JnL3JlcG8jYW5jaG9yKVwiXG4gICAgLy8gfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3J0OiAxOTYyLFxuICAgIGVtaXQ6IHRydWUsXG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBleHRSb290OiAnZXh0JyxcbiAgICBleHRGb2xkZXI6ICcuLi8uLi9ub2RlX21vZHVsZXMvQHNlbmNoYScsXG4gICAgcHJvZmlsZTogJycsIFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLCBcbiAgICB2ZXJib3NlOiAnbm8nLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHBhY2thZ2VzOiBudWxsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYXJzKCkge1xuICByZXR1cm4ge1xuICAgIGZpcnN0VGltZSA6IHRydWUsXG4gICAgZmlyc3RDb21waWxlOiB0cnVlLFxuICAgIGJyb3dzZXJDb3VudCA6IDAsXG4gICAgbWFuaWZlc3Q6IG51bGwsXG4gICAgZXh0UGF0aDogJ2V4dC1hbmd1bGFyJyxcbiAgICBwbHVnaW5FcnJvcnM6IFtdLFxuICAgIGRlcHM6IFtdLFxuICAgIHJlYnVpbGQ6IHRydWVcbiAgfVxufVxuXG5cblxuXG5mdW5jdGlvbiB0b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RnJvbVNvdXJjZShqcykge1xuICB2YXIgZ2VuZXJhdGUgPSByZXF1aXJlKFwiQGJhYmVsL2dlbmVyYXRvclwiKS5kZWZhdWx0XG4gIHZhciBwYXJzZSA9IHJlcXVpcmUoXCJiYWJ5bG9uXCIpLnBhcnNlXG4gIHZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoXCJhc3QtdHJhdmVyc2VcIilcbiAgY29uc3Qgc3RhdGVtZW50cyA9IFtdXG4gIHJldHVybiBzdGF0ZW1lbnRzICAvL3RlbXBvcmFyeSB1bnRpbCBhbmd1bGFyIHBhcnNlIGlzIHdyaXR0ZW5cbiAgXG4gIGNvbnN0IGFzdCA9IHBhcnNlKGpzLCB7XG4gICAgcGx1Z2luczogW1xuICAgICAgJ2pzeCcsXG4gICAgICAnZmxvdycsXG4gICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAnb2JqZWN0UmVzdFNwcmVhZCcsXG4gICAgICAnY2xhc3NQcm9wZXJ0aWVzJyxcbiAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICdhc3luY0dlbmVyYXRvcnMnLFxuICAgICAgJ2Z1bmN0aW9uQmluZCcsXG4gICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICdkeW5hbWljSW1wb3J0J1xuICAgIF0sXG4gICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgfSlcblxuICBmdW5jdGlvbiBhZGRUeXBlKGFyZ05vZGUpIHtcbiAgICB2YXIgdHlwZVxuICAgIGlmIChhcmdOb2RlLnR5cGUgPT09ICdTdHJpbmdMaXRlcmFsJykge1xuICAgICAgdmFyIHh0eXBlID0gdG9YdHlwZShhcmdOb2RlLnZhbHVlKVxuICAgICAgaWYgKHh0eXBlICE9ICdleHRyZWFjdCcpIHtcbiAgICAgICAgdHlwZSA9IHsgeHR5cGU6IHRvWHR5cGUoYXJnTm9kZS52YWx1ZSkgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlID0geyB4Y2xhc3M6IGpzLnNsaWNlKGFyZ05vZGUuc3RhcnQsIGFyZ05vZGUuZW5kKSB9XG4gICAgfVxuICAgIGlmICh0eXBlICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHR5cGUpXG4gICAgICBzdGF0ZW1lbnRzLnB1c2goYEV4dC5jcmVhdGUoJHtjb25maWd9KWApXG4gICAgfVxuICB9XG5cbiAgdHJhdmVyc2UoYXN0LCB7XG4gICAgcHJlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nXG4gICAgICAgICAgJiYgbm9kZS5jYWxsZWVcbiAgICAgICAgICAmJiBub2RlLmNhbGxlZS5vYmplY3RcbiAgICAgICAgICAmJiBub2RlLmNhbGxlZS5vYmplY3QubmFtZSA9PT0gJ0V4dCdcbiAgICAgICkge1xuICAgICAgICBzdGF0ZW1lbnRzLnB1c2goZ2VuZXJhdGUobm9kZSkuY29kZSlcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZhcmlhYmxlRGVjbGFyYXRvcicgXG4gICAgICAgICAgJiYgbm9kZS5pbml0IFxuICAgICAgICAgICYmIG5vZGUuaW5pdC50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nIFxuICAgICAgICAgICYmIG5vZGUuaW5pdC5jYWxsZWUgXG4gICAgICApIHtcbiAgICAgICAgaWYgKG5vZGUuaW5pdC5jYWxsZWUubmFtZSA9PSAncmVhY3RpZnknKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmluaXQuYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSBub2RlLmluaXQuYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZU5vZGUpIGNvbnRpbnVlO1xuICAgICAgICAgICAgYWRkVHlwZSh2YWx1ZU5vZGUpXG4gICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAvLyBDb252ZXJ0IFJlYWN0LmNyZWF0ZUVsZW1lbnQoLi4uKSBjYWxscyB0byB0aGUgZXF1aXZhbGVudCBFeHQuY3JlYXRlKC4uLikgY2FsbHMgdG8gcHV0IGluIHRoZSBtYW5pZmVzdC5cbiAgICAgIC8vIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbngnIFxuICAgICAgLy8gICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdCBcbiAgICAgIC8vICAgICAmJiBub2RlLmNhbGxlZS5vYmplY3QubmFtZSA9PT0gJ1JlYWN0JyBcbiAgICAgIC8vICAgICAmJiBub2RlLmNhbGxlZS5wcm9wZXJ0eS5uYW1lID09PSAnY3JlYXRlRWxlbWVudCcpIHtcbiAgICAgIC8vICAgY29uc3QgW3Byb3BzXSA9IG5vZGUuYXJndW1lbnRzXG4gICAgICAvLyAgIGxldCBjb25maWdcbiAgICAgIC8vICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMucHJvcGVydGllcykpIHtcbiAgICAgIC8vICAgICBjb25maWcgPSBnZW5lcmF0ZShwcm9wcykuY29kZVxuICAgICAgLy8gICAgIGZvciAobGV0IGtleSBpbiB0eXBlKSB7XG4gICAgICAvLyAgICAgICBjb25maWcgPSBge1xcbiAgJHtrZXl9OiAnJHt0eXBlW2tleV19Jywke2NvbmZpZy5zbGljZSgxKX1gXG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgLy8gICAgIGNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHR5cGUpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBzdGF0ZW1lbnRzXG59XG4iXX0=