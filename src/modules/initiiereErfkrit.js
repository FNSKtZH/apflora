'use strict';

var $ = require('jquery'),
    initiiereAp = require('./initiiereAp');
    //limiter = require('../lib/limiter');

var initiiereErfkrit = function() {

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    // Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
    (function($) {
        $.fn.extend( {
            limiter: function(limit, elem) {
                $(this).on("keyup focus", function() {
                    setCount(this, elem);
                });
                function setCount(src, elem) {
                    var chars = src.value.length;
                    if (chars > limit) {
                        src.value = src.value.substr(0, limit);
                        chars = limit;
                    }
                    elem.html( limit - chars );
                }
                setCount($(this)[0], elem);
            }
        });
    })(jQuery);

    if (!localStorage.erfkrit_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("erfkrit");
    // Daten für die erfkrit aus der DB holen
    var getErfkrit = $.ajax({
            type: 'get',
            url: 'php/erfkrit.php',
            dataType: 'json',
            data: {
                "id": localStorage.erfkrit_id
            }
        }),
        $ErfkritErreichungsgrad = $("#ErfkritErreichungsgrad");
    getErfkrit.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // erfkrit bereitstellen
            window.apf.erfkrit = data;
            // Felder mit Daten beliefern
            $("#ErfkritErreichungsgrad" + data.ErfkritErreichungsgrad).prop("checked", true);
            $("#ErfkritTxt")
                .val(data.ErfkritTxt)
                .limiter(255, $("#ErfkritTxt_limit"));
            // Formulare blenden
            window.apf.zeigeFormular("erfkrit");
            history.replaceState({erfkrit: "erfkrit"}, "erfkrit", "index.html?ap=" + localStorage.ap_id + "&erfkrit=" + localStorage.erfkrit_id);
            // bei neuen Datensätzen Fokus steuern
            if (!$ErfkritErreichungsgrad.val()) {
                $ErfkritErreichungsgrad.focus();
            }
        }
    });
};

module.exports = initiiereErfkrit;