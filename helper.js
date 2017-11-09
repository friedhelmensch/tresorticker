exports.extract = function (menu, today)
{
    var result = "Heute beim Tresor: \n";
    menu.reduce((initvalue, currentValue, i, array) => {
      if (currentValue === today) {
        //let´s see what happens if they don´t have tagesmenu on a specific day.
        result += array[i + 1] + "\n";
      }
      if (currentValue === "Täglich") {
        //assuming there are always 3 tagesgerichte
        result += array[i + 1] + "\n" + menu[i + 2] + "\n" + menu[i + 3];
      }
    }, 1);
    return result;
}

exports.getDay = function (dayAsNumber)
{
  var day = "Sonntag";
  if (dayAsNumber === 1) day = "Montag";
  if (dayAsNumber === 2) day = "Dienstag";
  if (dayAsNumber === 3) day = "Mittwoch";
  if (dayAsNumber === 4) day = "Donnerstag";
  if (dayAsNumber === 5) day = "Freitag";
  return day;
}

exports.getMenu = function (menuAsText)
{
  var splitted = menuAsText.split(/\n/g);
  var menu = [];
  splitted.forEach(function (element) {
    if (element != " \r") {
      menu.push(element.replace(" \r", ""));
    }
  });
  return menu;
}

