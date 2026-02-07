const cache = {
  chicken: { id: 1, title: 'Chicken soup' },
  'spagetti, tomato': { id: 2, title: 'Pomodoro' },
};

// console.log(cache['chicken']);

// import { useEffect, useState } from "react";

// function recipiesList() {
//   const [searchCache, setSearchCache] = useState({});
//   const [recipies, setRecipes] = useState([]);
//   const [term, setTerm] = useState('');

//   useEffect(() => {
//     if (!term) {
//       return;
//     }
//     if (searchCache[term]) {
//       setRecipes(searchCache[term]);
//       setTerm('');
//       return;
//     }
//     (async () => {
//       const resp = await fetch(`/api?includeIngredients=${term}`);
//       const data = await resp.json();
//       setRecipes(data.result);

//       setSearchCache((prev) => ({
//         ...prev,
//         [term]: data.result,
//       }));
//       setTerm('');
//     })();
//   }, [term, searchCache]);
  
//   return 
//   <p>
//     <ul>
//       <li>{recipies.map((iten) => {
//         {item.title}
//       })}</li>
//     </ul>
//   </p>;
// }

const nums = [1, 2, 3, 4];
 let hasDoubleItem = false;

nums.forEach((valEx, indexEx) => {
 nums.forEach((valInt, indexInt) => {
   if (valEx === valInt && indexEx !== indexInt) {
     hasDoubleItem = true;
   }
 });
});

console.log(hasDoubleItem);

