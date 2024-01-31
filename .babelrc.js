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
                "libraryName": "thoughtware-eam-ui",
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
                    return `thoughtware-eam-ui/es/${fullName}`;
                }
            },
            "thoughtware-eam-ui"
        ],
        [
            "import",
            {
                "libraryName": "thoughtware-plugin-manager-ui",
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
                    return `thoughtware-plugin-manager-ui/es/${fullName}`;
                }
            },
            "thoughtware-plugin-manager-ui"
        ],
        [
            "import",
            {
                "libraryName": "thoughtware-message-ui",
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
                    return `thoughtware-message-ui/es/${fullName}`;
                }
            },
            "thoughtware-message-ui"
        ],
        [
            "import",
            {
                "libraryName": "thoughtware-form-ui",
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
                    return `thoughtware-form-ui/es/${fullName}`;
                }
            },
            "thoughtware-form-ui"
        ],
        [
            "import",
            {
                "libraryName": "thoughtware-flow-ui",
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
                    return `thoughtware-flow-ui/es/${fullName}`;
                }
            },
            "thoughtware-flow-ui"
        ],
        [
            "import",
            {
                "libraryName": "thoughtware-licence-ui",
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
                    return `thoughtware-licence-ui/es/${fullName}`;
                }
            },
            "thoughtware-licence-ui"
        ],
        [
            "import", 
            {
                "libraryName": "thoughtware-security-ui",
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
                    return `thoughtware-security-ui/es/${fullName}`;
                }
            }, 
            "thoughtware-security-ui"
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