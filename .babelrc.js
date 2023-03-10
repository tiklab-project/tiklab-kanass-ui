const presets = [
        "@babel/preset-env",
        "@babel/preset-react"
]
const plugins = [
        "@babel/plugin-transform-react-jsx",
        [
            "@babel/plugin-transform-react-jsx-source"
        ],
        [
            "@babel/plugin-transform-arrow-functions"
        ],
        [
            "import",
            {
                "libraryName": "antd",
                "libraryDirectory": "es",
                "style": "css",
                
            }
        ],
        [
            "import",
            {
                "libraryName": "tiklab-eam-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-eam-ui/es/${fullName}`;
                }
            },
            "tiklab-eam-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-user-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-user-ui/es/${fullName}`;
                }
            },
            "tiklab-user-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-plugin-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-plugin-ui/es/${fullName}`;
                }
            },
            "tiklab-plugin-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-message-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-message-ui/es/${fullName}`;
                }
            },
            "tiklab-message-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-form-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-form-ui/es/${fullName}`;
                }
            },
            "tiklab-form-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-flow-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-flow-ui/es/${fullName}`;
                }
            },
            "tiklab-flow-ui"
        ],
        [
            "import",
            {
                "libraryName": "tiklab-licence-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-licence-ui/es/${fullName}`;
                }
            },
            "tiklab-licence-ui"
        ],
        [
            "import", 
            {
                "libraryName": "tiklab-todotask-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-todotask-ui/es/${fullName}`;
                }
            }, 
            "tiklab-todotask-ui"
        ],
        [
            "import", 
            {
                "libraryName": "tiklab-security-ui",
                "libraryDirectory": "es",
                "style": true,
                "customName": (name) => {
                    let split = name.split('-');
                    const fullName = split.reduce((total, currentValue, currentIndex, arr) => {
                        if(currentIndex=== 0) {
                            return total += currentValue;
                        }
                        const UpBit = currentValue.slice(0,1).toUpperCase();
                        const lowBit = currentValue.slice(1,currentValue.length);
                        const name = UpBit + lowBit
                        return total += name;
                    },'');
                    return `tiklab-security-ui/es/${fullName}`;
                }
            }, 
            "tiklab-security-ui"
        ],
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": false
            }
        ],
        [
            "dynamic-import-webpack"
        ],
        "@babel/plugin-syntax-dynamic-import",
        "react-hot-loader/babel"
]

module.exports = {presets,plugins}