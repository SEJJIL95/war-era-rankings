// test-simple.js
const { createAPIClient } = require('@wareraprojects/api');

console.log('Testing API Client...');

// اعمل client بتوكن حقيقي (استخدم التوكن بتاعك الحقيقي)
const client = createAPIClient({ 
    token: 'YOUR_REAL_TOKEN_HERE'  // حط التوكن الحقيقي بتاعك هنا
});

console.log('Client created:', client);
console.log('Client prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
console.log('Client own properties:', Object.keys(client));

// جرب نشوف إذا فيه طريقة search
if (client.searchAnything) {
    console.log('searchAnything exists!');
    try {
        const result = await client.searchAnything({ query: 'test' });
        console.log('Search result:', result);
    } catch(e) {
        console.log('Search error:', e.message);
    }
} else {
    console.log('searchAnything not found');
    console.log('Available:', Object.keys(client));
}