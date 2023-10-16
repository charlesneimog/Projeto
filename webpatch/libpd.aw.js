function createWasmAudioWorkletProcessor(audioParams){class WasmAudioWorkletProcessor extends AudioWorkletProcessor{constructor(args){super();globalThis.stackAlloc=Module["stackAlloc"];globalThis.stackSave=Module["stackSave"];globalThis.stackRestore=Module["stackRestore"];globalThis.HEAPU32=Module["HEAPU32"];globalThis.HEAPF32=Module["HEAPF32"];let opts=args.processorOptions;this.callbackFunction=Module["wasmTable"].get(opts["cb"]);this.userData=opts["ud"]}static get parameterDescriptors(){return audioParams}process(inputList,outputList,parameters){let numInputs=inputList.length,numOutputs=outputList.length,numParams=0,i,j,k,dataPtr,stackMemoryNeeded=(numInputs+numOutputs)*8,oldStackPtr=stackSave(),inputsPtr,outputsPtr,outputDataPtr,paramsPtr,didProduceAudio,paramArray;for(i of inputList)stackMemoryNeeded+=i.length*512;for(i of outputList)stackMemoryNeeded+=i.length*512;for(i in parameters)stackMemoryNeeded+=parameters[i].byteLength+8,++numParams;inputsPtr=stackAlloc(stackMemoryNeeded);k=inputsPtr>>2;dataPtr=inputsPtr+numInputs*8;for(i of inputList){HEAPU32[k++]=i.length;HEAPU32[k++]=dataPtr;for(j of i){HEAPF32.set(j,dataPtr>>2);dataPtr+=512}}outputsPtr=dataPtr;k=outputsPtr>>2;outputDataPtr=(dataPtr+=numOutputs*8)>>2;for(i of outputList){HEAPU32[k++]=i.length;HEAPU32[k++]=dataPtr;dataPtr+=512*i.length}paramsPtr=dataPtr;k=paramsPtr>>2;dataPtr+=numParams*8;for(i=0;paramArray=parameters[i++];){HEAPU32[k++]=paramArray.length;HEAPU32[k++]=dataPtr;HEAPF32.set(paramArray,dataPtr>>2);dataPtr+=paramArray.length*4}if(didProduceAudio=this.callbackFunction(numInputs,inputsPtr,numOutputs,outputsPtr,numParams,paramsPtr,this.userData)){for(i of outputList){for(j of i){for(k=0;k<128;++k){j[k]=HEAPF32[outputDataPtr++]}}}}stackRestore(oldStackPtr);return!!didProduceAudio}}return WasmAudioWorkletProcessor}class BootstrapMessages extends AudioWorkletProcessor{constructor(arg){super();globalThis.Module=arg["processorOptions"];globalThis.Module["instantiateWasm"]=(info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasm"],info);receiveInstance(instance,Module["wasm"]);return instance.exports};let p=globalThis["messagePort"]=this.port;p.onmessage=msg=>{let d=msg.data;if(d["_wpn"]){registerProcessor(d["_wpn"],createWasmAudioWorkletProcessor(d["audioParams"]));p.postMessage({"_wsc":d["callback"],"x":[d["contextHandle"],1,d["userData"]]})}else if(d["_wsc"]){Module["wasmTable"].get(d["_wsc"])(...d["x"])}}}process(){}}registerProcessor("message",BootstrapMessages);