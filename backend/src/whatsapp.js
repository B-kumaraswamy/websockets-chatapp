import * as dotenv from 'dotenv' 
import axios from 'axios'
import FormData from 'form-data'
import * as fs from 'fs'

dotenv.config() 

const WHATSAPP_TOKEN = 'EAAVgj8lB0nwBPSq8GEj7vQASoaudSjZC1oLOHFlCIsMxif8301i90Rq26iGg01iq3arSftvJWZBA4k1oSJaqIXQKuh8R610sO03ewIQYBkK2x2bMl3kWjmid7tByJuGgJQZCnIIA7o8yZCojg6qK9pnsZCJ9Ty1m9kZBoD3jZC1h6eRK1DmcmnbrZCjdNOJYAfZBZARgZDZD'



async function uploadImage() {
    const data = new FormData()
    data.append('messaging_product', 'whatsapp')
    data.append('file', fs.createReadStream(process.cwd() + '/logo.png'), { contentType: 'image/png' })
    data.append('type', 'image/png')

    const response = await axios({
        // https://graph.facebook.com/v22.0/692532637274940
        url: 'https://graph.facebook.com/v22.0/692532637274940/media',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
        },
        data: data
    })

    console.log(response.data) // 1176033427904571 
}

async function sendMediaMessage() {
    const response = await axios({
        url: 'https://graph.facebook.com/v22.0/692532637274940/messages',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to: '919290072744',
            type: 'image',
            image:{
                //link: 'https://dummyimage.com/600x400/000/fff.png&text=manfra.io',
                id: '1176033427904571',
                caption: 'గౌరవనీయులైన నాగరాజు గారికి శ్రీ చౌడేశ్వరి దేవి ఆలయం దసరా పండుగ వేడుకలకు ఐదు వందల రూపాయలు విరాళంగా  ఇచ్చినందుకు కృతజ్ఞతలు. ఇట్లు చౌడేశ్వరి దేవి ఆలయం కమిటీ.'
            }
        })
    })

    console.log(response.data)    
}

// uploadImage() 

sendMediaMessage()