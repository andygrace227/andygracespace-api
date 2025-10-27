import { InferenceClient } from '@huggingface/inference';
import { Readable } from 'node:stream';


class HuggingFaceBackend {

    constructor() {
        this.api_key = process.env.HUGGINGFACE_API_KEY;
        this.inference = new InferenceClient(this.api_key);
    }

    /// Just text.
    async generateCompletionStream(request) {
        try {
            const chatCompletion = this.inference.chatCompletionStream({...request,
                stream: true
            });

            return new Readable({
                async read(controller) {
                    const { done, value } = await chatCompletion.next?.() ?? {};
                    if (done) {
                        this.push(null);
                    } else {
                        try {
                            const text = value?.choices[0]?.delta?.content ?? '';
                            this.push(text);
                        } catch {
                            const text =  "API Backend Error. Please wait a while.";
                            this.push(text);
                            this.push(null);
                        }
                    }
                }
            });

        } catch (err) {
            console.log(err);
            return this.generateErrorStream();
        }
    }

    /// Allows tooling logic. Returns the entire object returned by the API backend.
    async generateToolStream(request) {
        try {
            const chatCompletion = this.inference.chatCompletionStream({...request,
                stream: true
            });

            return new Readable({
                async read(controller) {
                    const { done, value } = await chatCompletion.next?.() ?? {};
                    if (done) {
                        this.push(null);
                    } else {
                        try {
                            // Obfuscates the object to save on transfer size.
                            let obfuscatedChatObject = {
                                choices: [
                                    {
                                        delta: value?.choices[0]?.delta ?? '' 
                                    }
                                ]
                            };
                            this.push(JSON.stringify(obfuscatedChatObject));
                        } catch {
                            const text =  "API Backend Error. Please wait a while.";
                            this.push(text);
                            this.push(null);
                        }
                    }
                }
            });

        } catch (err) {
            console.log(err);
            return this.generateErrorStream();
        }
    }

    async generateErrorStream() {
        const text =  "API Backend Error. Please wait a while.";
        return new Readable({
            read() {
                this.push(text);
                this.push(null);
            }
        });
    }

}

export default HuggingFaceBackend;