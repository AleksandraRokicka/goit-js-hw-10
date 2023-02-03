import './css/styles.css';
import { debounce } from 'lodash'; //import biblioteki lodash
import Notiflix from 'notiflix'; // import biblioteki Notiflix
import {fetchCountries} from './fetchCountries'; //import funkcji z osobnego pliku

const debounceDelay = 300; //opoznienie 300ms. Po 0,3sek nieaktywnosci uzytkownika bedzie wykonywane zapytanie

var _ = require('lodash');
const input = document.getElementById('search-box'); //dobranie się do pola tekstowego/inputu
const countryList = document.querySelector('.country-list'); //dobranie sie do listy
const countryInfo = document.querySelector('.country-info'); //dobranie sie do diva

function clearCountries() { //funkcja, której zadaniem jest czyszczenie wyszukanych panstw
  countryList.innerHTML = ''; //zniknięcie listy krajów. wyczyszczenie listy wyszukiwania. innerHTML wpycha do html 'nic'.
  countryInfo.innerHTML = ''; //zniknięcie informacji o kraju. wyczyszczenie listy wyszukiwania. innerHTML wpycha do html 'nic'.
}

let countryName = () => {
  let newInput = input.value.trim(); //pobieram wartość z inputa. trim-rozwiazuje problem spacji na początku i na końcu w tekscie.
  clearCountries(); //wywołanie funkcji, ktora czyści wyniki wyszukiwania.
  if (newInput === '') {
    //jesli input = nic
    return; //zwracamy 'nic'
  } else {
    // w przeciwnym razie...
    fetchCountries(newInput) //wywolujemy funkcje z osobnego pliku-przefiltrowane dane (country, language)
      .then(data => {
        //wtedy dane
        console.log(data); //sie wykonsologowują (tablica z danymi WSZYSTKIMI, nie z tymi, ktore potrzebujemy)
          filteredArray(data); // wywolujemy funkcje, ktora filtruje dane, nizej jest opisana
      });
  }
};

let filteredArray = data => { //wywolanie funkcji ktora filtruje otrzymane dane. Ona robi cos z tymi danymi
    if (data.length > 10) {//jesli wyszukanych zostało wiecej niz 10 krajow 
        Notiflix.Notify.info(//to: informacja z notilixa, ze zbyt duzo dopasowan, wpisz scisla nazwe
            'Too many matches found. Please enter a more specific name.'
        );
        clearCountries();// musi byc clear, bo inaczej kraje sie beda nawarstwiac
    }
    else if (data.length > 1) { //jesli wyszukany jest wiecej niz 1 kraj
        clearCountries(); // znow czyszczę
        countryList.insertAdjacentHTML( //do ul wpisujemy proponowane nazwy krajow razem w flagą po lewe stronie, stad funkcja insertAdjHTML
            'beforeend',
            data.map(el => `<ul class="list-style flex" 
            <li class="list-item"><img src="${el.flags.svg}" width="50"/>
            </li>
            <li class="list-item">${el.name.official}</li></ul>`)
                .join('') // map bierze dane, robi petle i zaleznie od tego, co chce, to on cos z tym robi. Map zwroci tablice. El->to jest element danych.
            //tworzę tag ul, nadaje klase. W li tworze img (bo flaga) el.flags.svg -> el bo kazdy element, a flags.svg bo w consoli jest takie rozszerzenie. Prosza nas o nazwe oficjalna kraju, wiec biore el i name.official.
            //Join-bo nie ma ani spacji ani przecinka, tylko puste miejsce.
        );
    }
    else if (data.length === 1) {
      //jesli jest wyszukany tylko jeden kraj
      clearCountries(); //czyscimy
      countryInfo.insertAdjacentHTML(
        // wrzucam do diva za pomocą metody insertAdjacentHTML
        'beforeend',
        `<ul class="list-style">
            <li class="list-item country-style">${data[0].name.official} 
            </li>
            <li class="list-item">
            <img src="${data[0].flags.svg}" alt="Flag" width="150"/>
            </li>
            <li class="list-item">
            Capital:${data[0].capital}
            </li>
            <li class="list-item">
            Population: ${data[0].population}
            </li>
            <li class="list-item">
            Languages: ${Object.values(data[0].languages).join(', ')}</li></ul>`
        ); //data to jest tablica, a data[0] to pierwszy element tej tablicy
        //languages-> tam jest wiecej niz jedna opcja (kilka języków), dlatego wartości obiektu
        //w join daje przecinek, w celu oddzielenia kilku jezykow.
    }
    else if (data.status === 404) {//by uniknac bledu 404, dajemy info, ze nie ma takiej nazwy kraju
        Notiflix.Notify.failure('Oops, there is no country with that name');
    };
};

input.addEventListener('input', _.debounce(countryName, debounceDelay));
    
// name.official - pełna nazwa kraju
// capital - stolica
// population - liczba ludności
// flags.svg - link do ilustracji przedstawiającej flagę
// languages - tablica języków