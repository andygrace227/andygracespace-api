import { InferenceClient } from '@huggingface/inference';
import { Readable } from 'node:stream';


class HuggingFaceBackend {

    constructor() {
        let api_key = process.env.HUGGINGFACE_API_KEY;
        this.inference = new InferenceClient(api_key);
    }

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
                        const text = value?.choices[0]?.delta?.content ?? '';
                        this.push(text);
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