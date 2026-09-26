// Goethe grammar topics A1–C1, in German. Shown on the "Grammatik" tab.
// { cat, level, title, intro, rules: [..], tables: [{ caption, head: [..], rows: [[..]] }], examples: [..] }
// **text** is shown in bold.
window.GRAMMAR_CATEGORIES = [
  { id: "verben", title: "Verben & Zeiten", icon: "🏃" },
  { id: "nomen", title: "Nomen, Artikel & Kasus", icon: "📦" },
  { id: "pronomen", title: "Pronomen", icon: "👤" },
  { id: "adjektive", title: "Adjektive", icon: "🎨" },
  { id: "praepositionen", title: "Präpositionen", icon: "📍" },
  { id: "satzbau", title: "Satzbau & Konnektoren", icon: "🔗" },
];

window.GRAMMAR = [
  // ======================= VERBEN & ZEITEN =======================
  {
    cat: "verben", level: "A1", title: "Präsens: regelmäßige Verben",
    intro: "Das Präsens beschreibt, was jetzt passiert, was immer so ist – und oft auch die Zukunft (mit Zeitangabe: „Morgen fahre ich nach Berlin.“).",
    rules: [
      "Verbstamm = Infinitiv ohne **-en** / **-n**: lern-en → **lern**.",
      "An den Stamm kommen die Endungen **-e, -st, -t, -en, -t, -en**.",
      "Stamm endet auf **-d, -t, -m, -n** (arbeiten, finden, öffnen): du arbeit**est**, er arbeit**et**, ihr arbeit**et**.",
      "Stamm endet auf **-s, -ß, -z** (heißen, tanzen): du heiß**t**, du tanz**t** (nur -t).",
    ],
    tables: [{ caption: "lernen / arbeiten", head: ["Person", "Endung", "lernen", "arbeiten"], rows: [
      ["ich", "-e", "lerne", "arbeite"], ["du", "-st", "lernst", "arbeitest"], ["er / sie / es", "-t", "lernt", "arbeitet"],
      ["wir", "-en", "lernen", "arbeiten"], ["ihr", "-t", "lernt", "arbeitet"], ["sie / Sie", "-en", "lernen", "arbeiten"]] }],
    examples: ["Ich **wohne** in Berlin.", "Du **arbeitest** viel.", "Wir **lernen** jeden Tag Deutsch."],
  },
  {
    cat: "verben", level: "A1", title: "Präsens: sein, haben, werden und Vokalwechsel",
    intro: "Einige sehr wichtige Verben sind unregelmäßig. Viele starke Verben ändern in der **du**- und **er/sie/es**-Form ihren Vokal.",
    rules: [
      "Vokalwechsel **e → i**: sprechen – du spr**i**chst, er spr**i**cht (auch: geben, nehmen, essen, helfen, treffen).",
      "Vokalwechsel **e → ie**: lesen – du l**ie**st, er l**ie**st (auch: sehen, empfehlen).",
      "Vokalwechsel **a → ä / au → äu**: fahren – du f**ä**hrst; schlafen – er schl**ä**ft; laufen – er l**äu**ft.",
      "Die Formen mit **ich, wir, ihr, sie** bleiben regelmäßig: ich spreche, wir sprechen.",
    ],
    tables: [{ caption: "sein, haben, werden", head: ["Person", "sein", "haben", "werden"], rows: [
      ["ich", "bin", "habe", "werde"], ["du", "bist", "hast", "wirst"], ["er / sie / es", "ist", "hat", "wird"],
      ["wir", "sind", "haben", "werden"], ["ihr", "seid", "habt", "werdet"], ["sie / Sie", "sind", "haben", "werden"]] }],
    examples: ["Ich **bin** müde und **habe** Hunger.", "Er **spricht** gut Deutsch.", "Sie **liest** ein Buch.", "Du **fährst** zu schnell."],
  },
  {
    cat: "verben", level: "A1", title: "Trennbare und untrennbare Verben",
    intro: "Viele Verben haben eine Vorsilbe. Trennbare Vorsilben stehen im Hauptsatz am **Satzende**.",
    rules: [
      "Trennbare Vorsilben (betont): **ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, weg-, zu-, zurück-, fern-**.",
      "Hauptsatz: das Verb steht auf Position 2, die Vorsilbe am Ende: Ich **stehe** um 7 Uhr **auf**.",
      "Nebensatz und Infinitiv: zusammen – …, weil ich früh **aufstehe**. Ich muss früh **aufstehen**.",
      "Partizip II: **-ge-** in der Mitte: auf**ge**standen, ein**ge**kauft. Infinitiv mit zu: auf**zu**stehen.",
      "Untrennbare Vorsilben (unbetont): **be-, emp-, ent-, er-, ge-, miss-, ver-, zer-** – nie getrennt, Partizip ohne ge-: besucht, verstanden.",
    ],
    tables: [],
    examples: ["Der Zug **kommt** um 9 Uhr **an**.", "Ich **rufe** dich später **an**.", "Ich **verstehe** dich nicht.", "Wir haben gestern **eingekauft**."],
  },
  {
    cat: "verben", level: "A1", title: "Modalverben",
    intro: "Modalverben (können, müssen, dürfen, wollen, sollen, mögen / möchten) verändern die Bedeutung eines anderen Verbs. Das zweite Verb steht im **Infinitiv am Satzende**.",
    rules: [
      "**können** = Fähigkeit / Möglichkeit, **müssen** = Notwendigkeit, **dürfen** = Erlaubnis (nicht dürfen = Verbot).",
      "**wollen** = eigener Wunsch / Plan, **sollen** = Auftrag von einer anderen Person, Rat.",
      "**möchten** = höflicher Wunsch, **mögen** = etwas gern haben (meist mit Nomen: Ich mag Kaffee).",
      "ich- und er/sie/es-Form sind gleich und haben **keine Endung**: ich kann, er kann.",
      "Nicht müssen = nicht nötig: Du **musst nicht** kommen. (≠ Du **darfst nicht** kommen = Verbot.)",
    ],
    tables: [{ caption: "Präsens", head: ["Person", "können", "müssen", "dürfen", "wollen", "sollen", "möchten"], rows: [
      ["ich", "kann", "muss", "darf", "will", "soll", "möchte"], ["du", "kannst", "musst", "darfst", "willst", "sollst", "möchtest"],
      ["er / sie / es", "kann", "muss", "darf", "will", "soll", "möchte"], ["wir", "können", "müssen", "dürfen", "wollen", "sollen", "möchten"],
      ["ihr", "könnt", "müsst", "dürft", "wollt", "sollt", "möchtet"], ["sie / Sie", "können", "müssen", "dürfen", "wollen", "sollen", "möchten"]] }],
    examples: ["Ich **kann** gut **schwimmen**.", "Du **musst** heute **arbeiten**.", "Hier **darf** man nicht **rauchen**.", "Ich **möchte** einen Kaffee **trinken**."],
  },
  {
    cat: "verben", level: "A1", title: "Imperativ (Aufforderung)",
    intro: "Mit dem Imperativ gibt man Anweisungen, Bitten oder Ratschläge. Mit **bitte** wird er höflicher.",
    rules: [
      "**du**: du-Form ohne -st und ohne „du“: du kommst → **Komm!** du liest → **Lies!** (Vokalwechsel e→i/ie bleibt, a→ä nicht: **Fahr!**)",
      "**ihr**: ihr-Form ohne „ihr“: ihr kommt → **Kommt!**",
      "**Sie**: Verb + Sie: **Kommen Sie!**",
      "sein: **Sei** ruhig! **Seid** ruhig! **Seien Sie** ruhig!",
      "Trennbare Verben: Vorsilbe ans Ende: **Mach** das Fenster **zu**!",
    ],
    tables: [],
    examples: ["**Hilf** mir bitte!", "**Wartet** hier!", "**Nehmen Sie** Platz, bitte.", "**Ruf** mich morgen **an**!"],
  },
  {
    cat: "verben", level: "A1", title: "Perfekt (Vergangenheit – gesprochen)",
    intro: "Das Perfekt ist die wichtigste Vergangenheitsform im gesprochenen Deutsch: **haben / sein** (Position 2) + **Partizip II** (am Ende).",
    rules: [
      "Die meisten Verben bilden das Perfekt mit **haben**.",
      "Mit **sein**: Verben der Bewegung von A nach B (gehen, fahren, kommen, fliegen), Zustandsänderung (aufstehen, einschlafen, werden, sterben) und **sein, bleiben, passieren**.",
      "Regelmäßige Verben: **ge- + Stamm + -t**: machen → gemacht, arbeiten → gearbeitet.",
      "Unregelmäßige Verben: **ge- + (oft neuer Vokal) + -en**: fahren → gefahren, trinken → getrunken, gehen → gegangen.",
      "Kein ge-: Verben auf **-ieren** (studiert) und untrennbare Verben (besucht, verstanden). Trennbar: ein**ge**kauft.",
    ],
    tables: [{ caption: "Beispiele", head: ["Infinitiv", "Hilfsverb", "Partizip II"], rows: [
      ["machen", "hat", "gemacht"], ["essen", "hat", "gegessen"], ["fahren", "ist", "gefahren"], ["kommen", "ist", "gekommen"],
      ["aufstehen", "ist", "aufgestanden"], ["studieren", "hat", "studiert"], ["verstehen", "hat", "verstanden"], ["sein", "ist", "gewesen"]] }],
    examples: ["Ich **habe** Pizza **gegessen**.", "Wir **sind** nach Berlin **gefahren**.", "Er **ist** um 7 Uhr **aufgestanden**.", "Hast du den Film **gesehen**?"],
  },
  {
    cat: "verben", level: "A2", title: "Präteritum (Vergangenheit – geschrieben)",
    intro: "Das Präteritum benutzt man vor allem in geschriebenen Texten (Zeitung, Bericht, Märchen). Im Gespräch nutzt man es fast nur bei **sein, haben** und den **Modalverben**.",
    rules: [
      "Regelmäßige Verben: Stamm + **-te**: ich mach**te**, du mach**test**, wir mach**ten**.",
      "Unregelmäßige Verben haben einen neuen Stamm: gehen → **ging**, kommen → **kam**, fahren → **fuhr**, sehen → **sah**, geben → **gab**.",
      "ich- und er/sie/es-Form sind gleich und haben bei unregelmäßigen Verben **keine Endung**: ich ging, er ging.",
      "Modalverben: ohne Umlaut + -te: können → **konnte**, müssen → **musste**, wollen → **wollte**.",
    ],
    tables: [{ caption: "sein, haben, können", head: ["Person", "sein", "haben", "können", "machen"], rows: [
      ["ich", "war", "hatte", "konnte", "machte"], ["du", "warst", "hattest", "konntest", "machtest"], ["er / sie / es", "war", "hatte", "konnte", "machte"],
      ["wir", "waren", "hatten", "konnten", "machten"], ["ihr", "wart", "hattet", "konntet", "machtet"], ["sie / Sie", "waren", "hatten", "konnten", "machten"]] }],
    examples: ["Gestern **war** ich krank.", "Wir **hatten** keine Zeit.", "Als Kind **wohnte** er in Rumänien.", "Sie **ging** nach Hause."],
  },
  {
    cat: "verben", level: "A2", title: "Futur I – über die Zukunft sprechen",
    intro: "Das Futur I bildet man mit **werden** (konjugiert, Position 2) + **Infinitiv** (am Satzende). Im Alltag sagt man die Zukunft oft auch mit Präsens + Zeitangabe.",
    rules: [
      "Form: **werden + Infinitiv**: Ich **werde** morgen **arbeiten**.",
      "Benutzung 1 – Zukunft, Plan oder Versprechen: Ich **werde** dir **helfen**. Ich **werde** mehr Sport **machen**.",
      "Benutzung 2 – Vermutung über jetzt (oft mit wohl / wahrscheinlich): Er **wird** wohl krank **sein**.",
      "Benutzung 3 – energische Aufforderung: Du **wirst** jetzt sofort ins Bett **gehen**!",
      "Mit Präsens geht es auch, wenn die Zeit klar ist: Morgen **fahre** ich nach Berlin. (= Ich werde morgen nach Berlin fahren.)",
      "Nebensatz: werden steht ganz am Ende: …, dass ich morgen **kommen werde**.",
      "Mit Modalverb: zwei Infinitive am Ende: Ich **werde** länger **arbeiten müssen**.",
    ],
    tables: [{ caption: "werden + Infinitiv", head: ["Person", "werden", "Infinitiv (Ende)"], rows: [
      ["ich", "werde", "… lernen"], ["du", "wirst", "… lernen"], ["er / sie / es", "wird", "… lernen"],
      ["wir", "werden", "… lernen"], ["ihr", "werdet", "… lernen"], ["sie / Sie", "werden", "… lernen"]] }],
    examples: ["Nächstes Jahr **werde** ich in Deutschland **studieren**.", "Es **wird** morgen **regnen**.", "Sie **wird** schon zu Hause **sein**.", "Ich verspreche, dass ich pünktlich **sein werde**."],
  },
  {
    cat: "verben", level: "A2", title: "Reflexive Verben",
    intro: "Bei reflexiven Verben bezieht sich die Handlung auf das Subjekt selbst. Das Reflexivpronomen steht meist direkt nach dem Verb.",
    rules: [
      "Akkusativ (Normalfall): ich wasche **mich**. Dativ, wenn es schon ein Akkusativobjekt gibt: ich wasche **mir** die Hände.",
      "Nur bei **ich** und **du** gibt es einen Unterschied zwischen Akkusativ und Dativ.",
      "Immer reflexiv: sich freuen, sich beeilen, sich erinnern, sich erkälten, sich verabreden, sich bedanken, sich entscheiden.",
      "Im Nebensatz steht das Pronomen meist früh: …, weil ich **mich** auf den Urlaub freue.",
    ],
    tables: [{ caption: "Reflexivpronomen", head: ["Person", "Akkusativ", "Dativ"], rows: [
      ["ich", "mich", "mir"], ["du", "dich", "dir"], ["er / sie / es", "sich", "sich"], ["wir", "uns", "uns"], ["ihr", "euch", "euch"], ["sie / Sie", "sich", "sich"]] }],
    examples: ["Ich **freue mich** auf das Wochenende.", "**Beeil dich**!", "Wir **treffen uns** um acht.", "Ich putze **mir** die Zähne."],
  },
  {
    cat: "verben", level: "A2", title: "Verben mit Dativ",
    intro: "Die meisten Verben haben ein Akkusativobjekt. Einige wichtige Verben brauchen aber den **Dativ** (Frage: **Wem?**).",
    rules: [
      "Nur Dativ: **helfen, danken, gefallen, gehören, gratulieren, antworten, passen, schmecken, fehlen, zuhören, folgen, glauben** (jemandem).",
      "Dativ + Akkusativ (Person im Dativ, Sache im Akkusativ): **geben, schenken, zeigen, bringen, schicken, erklären, leihen, empfehlen**.",
      "Reihenfolge: zwei Nomen → **Dativ vor Akkusativ**; Akkusativ ist ein Pronomen → **Akkusativ vor Dativ** (Ich gebe **es dem Kind**).",
    ],
    tables: [],
    examples: ["Kannst du **mir** helfen?", "Das Buch gehört **meinem Bruder**.", "Wie gefällt **dir** die Stadt?", "Ich schenke **meiner Mutter** **einen Schal**."],
  },
  {
    cat: "verben", level: "B1", title: "Verben mit Präpositionen",
    intro: "Viele Verben haben eine feste Präposition. Man muss sie zusammen mit dem Verb lernen – der Kasus hängt von der Präposition ab.",
    rules: [
      "Mit Akkusativ: warten **auf**, denken **an**, sich erinnern **an**, sich freuen **auf** (Zukunft) / **über** (jetzt), sich interessieren **für**, sich kümmern **um**, sich ärgern **über**, sich bewerben **um**, bitten **um**, sprechen **über**.",
      "Mit Dativ: sprechen **mit**, teilnehmen **an**, abhängen **von**, träumen **von**, Angst haben **vor**, sich verabschieden **von**, fragen **nach**.",
      "Frage nach einer Sache: **wo(r) + Präposition**: **Worauf** wartest du? **Wofür** interessierst du dich?",
      "Frage nach einer Person: **Präposition + wen / wem**: **Auf wen** wartest du? **Mit wem** sprichst du?",
      "Pronomen für eine Sache: **da(r) + Präposition**: Ich warte **darauf**. Ich freue mich **darüber**. (r vor Vokal: da**r**an, wo**r**über)",
    ],
    tables: [],
    examples: ["Ich warte **auf den** Bus. – **Worauf** wartest du? – Ich warte **darauf**.", "Sie denkt oft **an ihre** Familie.", "Er nimmt **an dem** Kurs teil.", "Das hängt **vom** Wetter ab."],
  },
  {
    cat: "verben", level: "B1", title: "Plusquamperfekt (Vorvergangenheit)",
    intro: "Das Plusquamperfekt zeigt, dass etwas **vor** einer anderen Handlung in der Vergangenheit passiert ist.",
    rules: [
      "Form: **hatte / war** (Präteritum) + **Partizip II**.",
      "haben oder sein: wie beim Perfekt.",
      "Oft mit **nachdem**: Nachdem ich **gegessen hatte**, ging ich spazieren.",
    ],
    tables: [],
    examples: ["Als ich ankam, **war** der Zug schon **abgefahren**.", "Er **hatte** den Schlüssel **vergessen**.", "Nachdem wir **gearbeitet hatten**, gingen wir nach Hause."],
  },
  {
    cat: "verben", level: "B1", title: "Konjunktiv II: Wünsche, Höflichkeit, Irreales",
    intro: "Mit dem Konjunktiv II spricht man über Dinge, die nicht real sind (Wünsche, Träume), gibt Ratschläge und ist höflich.",
    rules: [
      "Die meisten Verben: **würde + Infinitiv**: Ich **würde** gern reisen.",
      "Eigene Formen bei: sein → **wäre**, haben → **hätte**, können → **könnte**, müssen → **müsste**, dürfen → **dürfte**, sollen → **sollte**, werden → **würde**, wissen → **wüsste**.",
      "Höfliche Bitte: **Könnten** Sie mir helfen? **Würden** Sie bitte das Fenster schließen?",
      "Ratschlag: Du **solltest** mehr schlafen. An deiner Stelle **würde** ich zum Arzt gehen.",
      "Irrealer Wunsch / Bedingung: **Wenn** ich Zeit **hätte**, **würde** ich mitkommen. Ich **wäre** gern am Meer.",
      "Vergangenheit: **hätte / wäre + Partizip II**: Wenn ich das **gewusst hätte**, **wäre** ich **gekommen**.",
    ],
    tables: [{ caption: "wäre / hätte / würde", head: ["Person", "sein", "haben", "werden"], rows: [
      ["ich", "wäre", "hätte", "würde"], ["du", "wärst", "hättest", "würdest"], ["er / sie / es", "wäre", "hätte", "würde"],
      ["wir", "wären", "hätten", "würden"], ["ihr", "wärt", "hättet", "würdet"], ["sie / Sie", "wären", "hätten", "würden"]] }],
    examples: ["Ich **hätte** gern ein Glas Wasser.", "Wenn ich reich **wäre**, **würde** ich ein Haus kaufen.", "**Könnten** Sie das bitte wiederholen?", "Du **hättest** früher kommen **sollen**."],
  },
  {
    cat: "verben", level: "B1", title: "Passiv",
    intro: "Im Passiv ist die Handlung wichtig, nicht die Person, die handelt. Das Objekt des Aktivsatzes wird zum Subjekt.",
    rules: [
      "Vorgangspassiv: **werden + Partizip II**: Das Haus **wird gebaut**.",
      "Präteritum: **wurde + Partizip II**: Das Haus **wurde** 1990 **gebaut**.",
      "Perfekt: **ist + Partizip II + worden**: Das Haus **ist gebaut worden**. (worden, nicht geworden!)",
      "Mit Modalverb: Modalverb + **Partizip II + werden**: Das Formular **muss ausgefüllt werden**.",
      "Wer handelt? **von + Dativ** (Person): …von dem Architekten; **durch + Akkusativ** (Mittel): …durch den Sturm.",
      "Zustandspassiv (Ergebnis): **sein + Partizip II**: Die Tür **ist geschlossen**.",
    ],
    tables: [{ caption: "Zeiten im Passiv", head: ["Zeit", "Beispiel"], rows: [
      ["Präsens", "Der Brief wird geschrieben."], ["Präteritum", "Der Brief wurde geschrieben."], ["Perfekt", "Der Brief ist geschrieben worden."],
      ["Plusquamperfekt", "Der Brief war geschrieben worden."], ["Futur I", "Der Brief wird geschrieben werden."], ["mit Modalverb", "Der Brief muss geschrieben werden."]] }],
    examples: ["In Österreich **wird** Deutsch **gesprochen**.", "Das Auto **wurde repariert**.", "Die Rechnung **muss** bis Freitag **bezahlt werden**.", "Das Geschäft **ist** heute **geschlossen**."],
  },
  {
    cat: "verben", level: "B1", title: "Infinitiv mit zu",
    intro: "Nach vielen Verben, Nomen und Adjektiven folgt ein Infinitiv mit **zu** (am Satzende).",
    rules: [
      "Nach Verben wie: anfangen, aufhören, versuchen, vergessen, hoffen, vorhaben, planen, beschließen, sich freuen, bitten, erlauben.",
      "Nach Ausdrücken wie: Lust haben, Zeit haben, Angst haben, es ist wichtig / schwer / schön / verboten.",
      "Trennbare Verben: zu steht in der Mitte: an**zu**rufen, auf**zu**stehen.",
      "**Kein zu** nach Modalverben und nach: gehen, lassen, sehen, hören, bleiben, lernen (Ich gehe schwimmen).",
    ],
    tables: [],
    examples: ["Ich habe keine Lust, **fernzusehen**.", "Es ist wichtig, regelmäßig Sport **zu treiben**.", "Vergiss nicht, mich **anzurufen**!", "Er versucht, pünktlich **zu sein**."],
  },
  {
    cat: "verben", level: "B1", title: "lassen",
    intro: "**lassen** hat mehrere Bedeutungen. Mit Infinitiv steht der Infinitiv (ohne zu) am Ende.",
    rules: [
      "Etwas machen lassen (eine andere Person macht es): Ich **lasse** mein Auto **reparieren**.",
      "Erlauben: Meine Eltern **lassen** mich am Wochenende **ausgehen**.",
      "Nicht mitnehmen / zurücklassen: Ich **lasse** den Schlüssel zu Hause.",
      "Perfekt mit Infinitiv: Ich **habe** mir die Haare **schneiden lassen** (nicht: gelassen).",
    ],
    tables: [],
    examples: ["Wir **lassen** die Wohnung **renovieren**.", "**Lass** mich in Ruhe!", "Er **ließ** das Handy im Auto."],
  },
  {
    cat: "verben", level: "B2", title: "Futur II",
    intro: "Das Futur II beschreibt eine Handlung, die in der Zukunft **abgeschlossen** sein wird – oder eine Vermutung über die Vergangenheit.",
    rules: [
      "Form: **werden + Partizip II + haben / sein**.",
      "Abgeschlossen in der Zukunft: Bis morgen **werde** ich das Buch **gelesen haben**.",
      "Vermutung über Vergangenes (oft mit wohl): Er **wird** den Zug **verpasst haben**.",
    ],
    tables: [],
    examples: ["In zwei Jahren **werde** ich mein Studium **abgeschlossen haben**.", "Sie **wird** wohl schon **angekommen sein**."],
  },
  {
    cat: "verben", level: "C1", title: "Konjunktiv I – indirekte Rede",
    intro: "In Zeitungen, Berichten und offiziellen Texten gibt man mit dem Konjunktiv I wieder, was jemand gesagt hat, ohne es selbst zu behaupten.",
    rules: [
      "Form: Infinitivstamm + **-e, -est, -e, -en, -et, -en**. Wichtig ist vor allem die 3. Person: er **komme**, er **habe**, er **könne**.",
      "sein: ich sei, du sei(e)st, er **sei**, wir seien, ihr seiet, sie **seien**.",
      "Sind Konjunktiv I und Indikativ gleich (sie haben), nimmt man den **Konjunktiv II** (sie **hätten**).",
      "Vergangenheit: **habe / sei + Partizip II**: Er sagte, er **sei** krank **gewesen**.",
      "Zukunft: **werde + Infinitiv**: Sie sagt, sie **werde** morgen **kommen**.",
    ],
    tables: [{ caption: "Direkte → indirekte Rede", head: ["direkt", "indirekt"], rows: [
      ["„Ich bin krank.“", "Er sagt, er sei krank."], ["„Wir haben keine Zeit.“", "Sie sagen, sie hätten keine Zeit."],
      ["„Ich habe das Problem gelöst.“", "Er behauptet, er habe das Problem gelöst."], ["„Kommst du mit?“", "Sie fragt, ob ich mitkomme / mitkäme."]] }],
    examples: ["Der Minister erklärte, die Lage **sei** unter Kontrolle.", "Laut Bericht **habe** die Firma Gewinn **gemacht**."],
  },
  {
    cat: "verben", level: "C1", title: "Passiversatzformen",
    intro: "Statt Passiv mit Modalverb (kann / muss … werden) gibt es kürzere, oft elegantere Formen.",
    rules: [
      "**sich lassen + Infinitiv** = kann … werden: Das Problem **lässt sich lösen**.",
      "**sein + zu + Infinitiv** = kann / muss … werden: Die Rechnung **ist** bis Freitag **zu bezahlen**.",
      "Adjektive auf **-bar / -lich**: Das Problem ist **lösbar**. Die Schrift ist **unleserlich**.",
      "**man** + Aktiv: Hier spricht **man** Deutsch.",
    ],
    tables: [],
    examples: ["Der Fehler **lässt sich** leicht **beheben**.", "Die Anweisungen **sind** genau **zu befolgen**.", "Diese Aufgabe ist in einer Stunde **machbar**."],
  },

  // ======================= NOMEN, ARTIKEL & KASUS =======================
  {
    cat: "nomen", level: "A1", title: "Genus: der, die, das",
    intro: "Jedes Nomen hat ein Genus: maskulin (**der**), feminin (**die**) oder neutral (**das**). Im Plural ist der Artikel immer **die**. Lerne jedes Nomen mit Artikel!",
    rules: [
      "Oft **der**: Tage, Monate, Jahreszeiten (der Montag, der Mai, der Sommer), Nomen auf **-er** (Personen), **-ling, -ismus, -ist**.",
      "Oft **die**: Nomen auf **-ung, -heit, -keit, -schaft, -ion, -tät, -ie, -ik** und viele auf **-e** (die Lampe).",
      "Oft **das**: Nomen auf **-chen, -lein** (das Mädchen), **-um, -ment**, Infinitive als Nomen (das Essen).",
      "Zusammengesetzte Nomen: das **letzte** Wort bestimmt den Artikel: das Haus + **die Tür** = **die** Haustür.",
    ],
    tables: [],
    examples: ["**der** Tisch, **die** Lampe, **das** Buch", "**die** Zeitung, **die** Freiheit, **das** Mädchen", "**der** Kühlschrank (der Schrank)"],
  },
  {
    cat: "nomen", level: "A1", title: "Nominativ: bestimmter und unbestimmter Artikel",
    intro: "Der Nominativ ist der Kasus des **Subjekts** (Frage: Wer? / Was?). Nach **sein, werden, heißen, bleiben** steht auch der Nominativ.",
    rules: [
      "Bestimmter Artikel (der / die / das) = bekannte, konkrete Sache: **Der** Kaffee ist heiß.",
      "Unbestimmter Artikel (ein / eine) = neu, nicht bekannt, eine von vielen: Das ist **ein** Hund.",
      "Im Plural gibt es keinen unbestimmten Artikel: Das sind **Hunde**. Negation: **kein / keine**.",
      "maskulin: der / ein / kein – feminin: die / eine / keine – neutral: das / ein / kein – Plural: die / – / keine.",
    ],
    tables: [{ caption: "Nominativ", head: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["bestimmt", "der Mann", "die Frau", "das Kind", "die Kinder"], ["unbestimmt", "ein Mann", "eine Frau", "ein Kind", "– Kinder"],
      ["Negation", "kein Mann", "keine Frau", "kein Kind", "keine Kinder"], ["Possessiv", "mein Mann", "meine Frau", "mein Kind", "meine Kinder"]] }],
    examples: ["**Der** Lehrer heißt Peter.", "Das ist **eine** gute Idee.", "**Mein** Bruder ist Student.", "Das ist **kein** Problem."],
  },
  {
    cat: "nomen", level: "A1", title: "Akkusativ",
    intro: "Der Akkusativ ist der Kasus des **direkten Objekts** (Frage: Wen? / Was?).",
    rules: [
      "**Nur maskulin ändert sich**: der → **den**, ein → **einen**, kein → **keinen**, mein → **meinen**.",
      "Feminin, neutral und Plural sind gleich wie im Nominativ.",
      "Typische Verben mit Akkusativ: haben, brauchen, kaufen, sehen, suchen, finden, essen, trinken, besuchen, **es gibt**.",
      "Auch nach Akkusativ-Präpositionen: durch, für, gegen, ohne, um.",
    ],
    tables: [{ caption: "Akkusativ", head: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["bestimmt", "den Mann", "die Frau", "das Kind", "die Kinder"], ["unbestimmt", "einen Mann", "eine Frau", "ein Kind", "– Kinder"],
      ["Negation", "keinen Mann", "keine Frau", "kein Kind", "keine Kinder"]] }],
    examples: ["Ich habe **einen** Bruder.", "Wir kaufen **den** Tisch.", "Es gibt hier **keinen** Supermarkt.", "Ich brauche **einen** Stift."],
  },
  {
    cat: "nomen", level: "A2", title: "Dativ",
    intro: "Der Dativ ist der Kasus des **indirekten Objekts** – oft eine Person, die etwas bekommt (Frage: **Wem?**).",
    rules: [
      "Artikel: maskulin **dem / einem**, feminin **der / einer**, neutral **dem / einem**, Plural **den**.",
      "Im Plural bekommt das Nomen ein **-n**: mit den Kinder**n** (außer bei Plural auf -s: den Autos).",
      "Nach Dativ-Präpositionen: aus, bei, mit, nach, seit, von, zu, gegenüber.",
      "Nach Verben wie helfen, danken, gefallen, gehören, geben, schenken, zeigen.",
      "Wechselpräpositionen mit Frage **Wo?** → Dativ.",
    ],
    tables: [{ caption: "Dativ", head: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["bestimmt", "dem Mann", "der Frau", "dem Kind", "den Kindern"], ["unbestimmt", "einem Mann", "einer Frau", "einem Kind", "– Kindern"],
      ["Negation", "keinem Mann", "keiner Frau", "keinem Kind", "keinen Kindern"]] }],
    examples: ["Ich helfe **dem** Mann.", "Er fährt mit **der** Straßenbahn.", "Sie schenkt **ihrem** Vater ein Buch.", "Ich spiele mit **den** Kinder**n**."],
  },
  {
    cat: "nomen", level: "B1", title: "Genitiv",
    intro: "Der Genitiv zeigt Besitz oder Zugehörigkeit (Frage: **Wessen?**). Er steht nach dem Nomen, zu dem er gehört.",
    rules: [
      "Artikel: maskulin / neutral **des / eines**, feminin / Plural **der / einer**.",
      "Maskuline und neutrale Nomen bekommen **-s** oder **-es** (einsilbig): des Mann**es**, des Auto**s**.",
      "Namen: **-s** ohne Apostroph: Annas Buch, Peters Auto.",
      "Nach Genitiv-Präpositionen: wegen, trotz, während, statt, innerhalb, außerhalb.",
      "Im Gespräch sagt man oft **von + Dativ**: das Auto **von meinem Vater**.",
    ],
    tables: [{ caption: "Genitiv", head: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["bestimmt", "des Mannes", "der Frau", "des Kindes", "der Kinder"], ["unbestimmt", "eines Mannes", "einer Frau", "eines Kindes", "– Kinder"]] }],
    examples: ["Das ist das Auto **meines Vaters**.", "Die Farbe **des Hauses** gefällt mir.", "Wegen **des Regens** bleiben wir zu Hause."],
  },
  {
    cat: "nomen", level: "A1", title: "Übersicht: alle Artikel in allen Kasus",
    intro: "Die vier Kasus auf einen Blick. Frage: Nominativ **Wer? Was?** – Akkusativ **Wen? Was?** – Dativ **Wem?** – Genitiv **Wessen?**",
    rules: [
      "Der Kasus hängt vom **Verb** oder von der **Präposition** ab.",
      "Merke: Dativ Plural immer **den** + Nomen mit **-n**.",
    ],
    tables: [
      { caption: "Bestimmter Artikel", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
        ["Nominativ", "der", "die", "das", "die"], ["Akkusativ", "den", "die", "das", "die"], ["Dativ", "dem", "der", "dem", "den (+n)"], ["Genitiv", "des (+s)", "der", "des (+s)", "der"]] },
      { caption: "Unbestimmter Artikel / kein", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
        ["Nominativ", "ein", "eine", "ein", "keine"], ["Akkusativ", "einen", "eine", "ein", "keine"], ["Dativ", "einem", "einer", "einem", "keinen (+n)"], ["Genitiv", "eines (+s)", "einer", "eines (+s)", "keiner"]] },
    ],
    examples: ["**Der** Mann (N) gibt **dem** Kind (D) **einen** Apfel (A).", "Das ist das Fahrrad **der** Lehrerin (G)."],
  },
  {
    cat: "nomen", level: "A1", title: "Negation: nicht und kein",
    intro: "Im Deutschen gibt es zwei Wörter für die Verneinung: **kein** und **nicht**.",
    rules: [
      "**kein** verneint Nomen mit unbestimmtem Artikel oder ohne Artikel: Ich habe **kein** Auto / **keine** Zeit / **kein** Geld.",
      "kein wird dekliniert wie ein: keinen Hund, keiner Frau.",
      "**nicht** verneint Verben, Adjektive, Adverbien, Nomen mit bestimmtem Artikel oder Possessivartikel, Namen.",
      "Position von nicht: am Satzende, wenn der ganze Satz verneint ist (Ich komme heute **nicht**) – sonst **vor** dem verneinten Teil: vor Adjektiv, Präposition, Infinitiv / Partizip (Das ist **nicht** teuer. Ich wohne **nicht** in Berlin.).",
    ],
    tables: [],
    examples: ["Ich trinke **keinen** Kaffee.", "Ich verstehe dich **nicht**.", "Das Essen ist **nicht** gut.", "Er hat **keine** Geschwister."],
  },
  {
    cat: "nomen", level: "A1", title: "Plural der Nomen",
    intro: "Es gibt mehrere Pluralendungen. Lerne den Plural immer mit dem Nomen. Der Artikel im Plural ist immer **die**.",
    rules: [
      "**-e** (oft maskulin): der Tag → die Tag**e**; mit Umlaut: die Stadt → die St**ä**dt**e**.",
      "**-(e)n** (fast alle Feminina): die Frau → die Frau**en**, die Lampe → die Lampe**n**.",
      "**-er** / **¨-er** (oft neutral): das Kind → die Kind**er**, das Buch → die B**ü**ch**er**.",
      "**-** / **¨** (Nomen auf -er, -el, -en): der Lehrer → die Lehrer, die Mutter → die M**ü**tter.",
      "**-s** (Fremdwörter, Wörter auf Vokal): das Auto → die Auto**s**, das Hotel → die Hotel**s**.",
    ],
    tables: [],
    examples: ["ein Apfel – zwei **Äpfel**", "ein Zimmer – drei **Zimmer**", "eine Woche – zwei **Wochen**"],
  },
  {
    cat: "nomen", level: "B1", title: "n-Deklination",
    intro: "Einige maskuline Nomen bekommen in allen Kasus außer im Nominativ Singular die Endung **-(e)n**.",
    rules: [
      "Maskuline Nomen auf **-e**: der Junge, der Kollege, der Kunde, der Name (Genitiv: des Namens).",
      "Auf **-ent, -ant, -ist, -oge**: der Student, der Präsident, der Polizist, der Biologe.",
      "Einige andere: **der Herr** (den Herrn), der Mensch, der Nachbar, der Bär.",
    ],
    tables: [{ caption: "der Student", head: ["Kasus", "Singular", "Plural"], rows: [
      ["Nominativ", "der Student", "die Studenten"], ["Akkusativ", "den Student**en**", "die Studenten"], ["Dativ", "dem Student**en**", "den Studenten"], ["Genitiv", "des Student**en**", "der Studenten"]] }],
    examples: ["Ich frage **den Kollegen**.", "Das Buch gehört **dem Studenten**.", "Kennst du **den Herrn**?"],
  },
  {
    cat: "nomen", level: "C1", title: "Nominalisierung",
    intro: "In wissenschaftlichen und offiziellen Texten macht man aus Verben und Nebensätzen oft **Nomen** (Nominalstil).",
    rules: [
      "Verb → Nomen: entscheiden → die **Entscheidung**, ankommen → die **Ankunft**, lesen → das **Lesen**.",
      "weil / da → **wegen** + Genitiv: Weil es regnete … → **Wegen des Regens** …",
      "obwohl → **trotz** + Genitiv: Obwohl es kalt war … → **Trotz der Kälte** …",
      "nachdem / als → **nach / bei** + Dativ: Nachdem er angekommen war … → **Nach seiner Ankunft** …",
      "um … zu / damit → **zu / zum / zur** + Dativ: Um Geld zu sparen … → **Zum Sparen** von Geld …",
      "wenn / falls → **bei** + Dativ: Wenn es regnet … → **Bei Regen** …",
    ],
    tables: [],
    examples: ["Nach **der Unterzeichnung** des Vertrags beginnt das Projekt.", "**Bei Fragen** wenden Sie sich an uns.", "**Aufgrund der steigenden Kosten** wurde das Projekt gestoppt."],
  },

  // ======================= PRONOMEN =======================
  {
    cat: "pronomen", level: "A1", title: "Personalpronomen",
    intro: "Personalpronomen ersetzen Nomen. Sie haben in jedem Kasus eine andere Form.",
    rules: [
      "**Sie** (groß) = höfliche Anrede für eine oder mehrere Personen – Verb wie bei „sie“ (Plural).",
      "er / sie / es richtet sich nach dem **Genus** des Nomens: der Tisch → **er**, die Lampe → **sie**, das Buch → **es**.",
      "Frage: Wer? (Nom.) – Wen? (Akk.) – Wem? (Dat.)",
    ],
    tables: [{ caption: "Personalpronomen", head: ["Nominativ", "Akkusativ", "Dativ"], rows: [
      ["ich", "mich", "mir"], ["du", "dich", "dir"], ["er", "ihn", "ihm"], ["sie", "sie", "ihr"], ["es", "es", "ihm"],
      ["wir", "uns", "uns"], ["ihr", "euch", "euch"], ["sie / Sie", "sie / Sie", "ihnen / Ihnen"]] }],
    examples: ["Ich sehe **ihn** morgen.", "Kannst du **mir** helfen?", "Der Kaffee ist gut. **Er** ist heiß.", "Wie geht es **Ihnen**?"],
  },
  {
    cat: "pronomen", level: "A1", title: "Possessivartikel",
    intro: "Possessivartikel zeigen, wem etwas gehört. Die Endungen sind wie bei **ein / kein**.",
    rules: [
      "ich → **mein**, du → **dein**, er / es → **sein**, sie → **ihr**, wir → **unser**, ihr → **euer**, sie → **ihr**, Sie → **Ihr**.",
      "Die Endung hängt vom Nomen danach ab (Genus und Kasus), nicht vom Besitzer: **meine** Mutter, **mein** Vater.",
      "euer + Endung → das e fällt weg: **eure** Wohnung.",
    ],
    tables: [{ caption: "mein-", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["Nominativ", "mein", "meine", "mein", "meine"], ["Akkusativ", "meinen", "meine", "mein", "meine"],
      ["Dativ", "meinem", "meiner", "meinem", "meinen"], ["Genitiv", "meines", "meiner", "meines", "meiner"]] }],
    examples: ["Das ist **mein** Bruder und das ist **meine** Schwester.", "Er besucht **seine** Eltern.", "Wir fahren mit **unserem** Auto.", "Ist das **Ihr** Koffer?"],
  },
  {
    cat: "pronomen", level: "A2", title: "Indefinitpronomen: man, jemand, niemand, etwas, nichts",
    intro: "Mit Indefinitpronomen spricht man über Personen oder Dinge, die nicht genau bestimmt sind.",
    rules: [
      "**man** = die Leute allgemein, immer mit Verb in der 3. Person Singular: Hier **darf** man nicht rauchen.",
      "**jemand** (eine Person) / **niemand** (keine Person): Akkusativ jemand(en), Dativ jemand(em).",
      "**etwas** (eine Sache) / **nichts** (keine Sache) – bleiben immer gleich.",
      "**alle, viele, einige, wenige** + Verb im Plural. **jeder / jede / jedes** + Verb im Singular.",
    ],
    tables: [],
    examples: ["**Man** spricht hier Deutsch.", "Ist **jemand** zu Hause? – Nein, **niemand**.", "Möchtest du **etwas** trinken? – Nein, **nichts**, danke.", "**Jeder** kennt das Problem."],
  },
  {
    cat: "pronomen", level: "B1", title: "Relativpronomen und Relativsätze",
    intro: "Ein Relativsatz beschreibt ein Nomen genauer. Er ist ein Nebensatz: das Verb steht **am Ende**.",
    rules: [
      "**Genus und Numerus** des Relativpronomens kommen vom Nomen, auf das es sich bezieht.",
      "Der **Kasus** kommt von der Funktion im Relativsatz (Subjekt, Akkusativobjekt, Dativobjekt …).",
      "Mit Präposition: die Präposition steht vor dem Relativpronomen: der Freund, **mit dem** ich spreche.",
      "Nach alles, etwas, nichts, das (Superlativ): **was**. Nach Orten: **wo**: die Stadt, **wo** ich wohne.",
    ],
    tables: [{ caption: "Relativpronomen", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
      ["Nominativ", "der", "die", "das", "die"], ["Akkusativ", "den", "die", "das", "die"], ["Dativ", "dem", "der", "dem", "denen"], ["Genitiv", "dessen", "deren", "dessen", "deren"]] }],
    examples: ["Das ist der Mann, **der** neben mir wohnt.", "Das ist die Frau, **die** ich gestern getroffen habe.", "Das sind die Kinder, **denen** ich helfe.", "Alles, **was** du sagst, ist richtig."],
  },

  // ======================= ADJEKTIVE =======================
  {
    cat: "adjektive", level: "A2", title: "Komparativ und Superlativ",
    intro: "Mit Komparativ und Superlativ vergleicht man Personen und Dinge.",
    rules: [
      "Komparativ: Adjektiv + **-er** + **als**: Berlin ist größ**er als** Bonn.",
      "Superlativ: **am** + Adjektiv + **-sten**: Er läuft **am schnellsten**. Vor Nomen: der schnell**ste** Läufer.",
      "Nach -d, -t, -s, -ß, -z: **-esten**: am ält**esten**, am kürz**esten**.",
      "Viele einsilbige Adjektive bekommen einen Umlaut: alt – **ä**lter, groß – gr**ö**ßer, jung – j**ü**nger, warm – w**ä**rmer.",
      "Gleich: **so + Adjektiv + wie**: Er ist **so groß wie** ich.",
    ],
    tables: [{ caption: "Unregelmäßige Formen", head: ["Grundform", "Komparativ", "Superlativ"], rows: [
      ["gut", "besser", "am besten"], ["viel", "mehr", "am meisten"], ["gern", "lieber", "am liebsten"],
      ["hoch", "höher", "am höchsten"], ["nah", "näher", "am nächsten"], ["groß", "größer", "am größten"]] }],
    examples: ["Mein Bruder ist **älter als** ich.", "Ich trinke **lieber** Tee **als** Kaffee.", "Das ist **das beste** Restaurant der Stadt.", "Heute ist es **so kalt wie** gestern."],
  },
  {
    cat: "adjektive", level: "B1", title: "Adjektivdeklination",
    intro: "Steht ein Adjektiv **vor** einem Nomen, bekommt es eine Endung. Nach sein / werden (prädikativ) bleibt es ohne Endung: Das Auto ist **neu**.",
    rules: [
      "Nach **bestimmtem Artikel** (der, dieser, jeder): meist **-e** oder **-en**.",
      "Nach **unbestimmtem Artikel** (ein, kein, mein): wie nach bestimmtem Artikel – aber wo ein / kein keine Endung hat, zeigt das Adjektiv das Genus: ein gut**er** Mann, ein gut**es** Kind.",
      "**Ohne Artikel**: das Adjektiv übernimmt die Endung des bestimmten Artikels (gut**er** Wein ← de**r**), außer im Genitiv maskulin / neutral (-en).",
      "Tipp: Im Dativ und Genitiv ist die Endung nach Artikel immer **-en**.",
    ],
    tables: [
      { caption: "Nach bestimmtem Artikel", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
        ["Nominativ", "der gute Mann", "die gute Frau", "das gute Kind", "die guten Kinder"], ["Akkusativ", "den guten Mann", "die gute Frau", "das gute Kind", "die guten Kinder"],
        ["Dativ", "dem guten Mann", "der guten Frau", "dem guten Kind", "den guten Kindern"], ["Genitiv", "des guten Mannes", "der guten Frau", "des guten Kindes", "der guten Kinder"]] },
      { caption: "Nach unbestimmtem Artikel / kein / mein", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
        ["Nominativ", "ein guter Mann", "eine gute Frau", "ein gutes Kind", "keine guten Kinder"], ["Akkusativ", "einen guten Mann", "eine gute Frau", "ein gutes Kind", "keine guten Kinder"],
        ["Dativ", "einem guten Mann", "einer guten Frau", "einem guten Kind", "keinen guten Kindern"], ["Genitiv", "eines guten Mannes", "einer guten Frau", "eines guten Kindes", "keiner guten Kinder"]] },
      { caption: "Ohne Artikel", head: ["Kasus", "maskulin", "feminin", "neutral", "Plural"], rows: [
        ["Nominativ", "guter Wein", "gute Milch", "gutes Brot", "gute Äpfel"], ["Akkusativ", "guten Wein", "gute Milch", "gutes Brot", "gute Äpfel"],
        ["Dativ", "gutem Wein", "guter Milch", "gutem Brot", "guten Äpfeln"], ["Genitiv", "guten Weines", "guter Milch", "guten Brotes", "guter Äpfel"]] },
    ],
    examples: ["Ich suche eine **günstige** Wohnung.", "Wir wohnen in einem **alten** Haus.", "Der **neue** Kollege ist sehr nett.", "Ich trinke gern **kaltes** Wasser."],
  },
  {
    cat: "adjektive", level: "C1", title: "Partizipien als Adjektive",
    intro: "Partizipien können wie Adjektive vor einem Nomen stehen und werden dann auch dekliniert.",
    rules: [
      "**Partizip I** (Infinitiv + **-d**) = aktiv und gleichzeitig: das schlafen**d**e Kind (= das Kind, das schläft).",
      "**Partizip II** = passiv oder abgeschlossen: das **gekochte** Ei (= das Ei, das gekocht wurde).",
      "Erweitertes Partizipialattribut: Ergänzungen stehen zwischen Artikel und Partizip: der **seit Jahren in Berlin lebende** Autor.",
      "**zu + Partizip I** = etwas muss / kann gemacht werden: die **zu lösenden** Probleme (= die Probleme, die gelöst werden müssen).",
    ],
    tables: [],
    examples: ["Die **steigenden** Preise machen vielen Menschen Sorgen.", "Das **gestohlene** Auto wurde gefunden.", "Die **im letzten Jahr durchgeführte** Studie zeigt …", "Das ist ein **nicht zu unterschätzendes** Risiko."],
  },

  // ======================= PRÄPOSITIONEN =======================
  {
    cat: "praepositionen", level: "A2", title: "Präpositionen mit Akkusativ",
    intro: "Nach diesen Präpositionen steht **immer der Akkusativ**.",
    rules: [
      "**durch, für, gegen, ohne, um** (Merkwort: **DOGFU**) – dazu **bis** und **entlang** (steht nach dem Nomen: den Fluss entlang).",
      "**für** = Zweck, Empfänger: ein Geschenk **für dich**.",
      "**um** = Uhrzeit oder rund herum: **um** 8 Uhr, **um** das Haus.",
      "**gegen** = Kontakt, Opposition, ungefähre Zeit: **gegen** die Wand, **gegen** 8 Uhr.",
    ],
    tables: [],
    examples: ["Wir gehen **durch den** Park.", "Das Geschenk ist **für meinen** Vater.", "Ich trinke Kaffee **ohne** Zucker.", "Er ist **gegen den** Plan."],
  },
  {
    cat: "praepositionen", level: "A2", title: "Präpositionen mit Dativ",
    intro: "Nach diesen Präpositionen steht **immer der Dativ** – auch bei Bewegung (Wohin?).",
    rules: [
      "**aus, bei, mit, nach, seit, von, zu** – dazu **gegenüber** und **ab**.",
      "**aus** = Herkunft, aus etwas heraus: Ich komme **aus** Rumänien.",
      "**bei** = bei einer Person / Firma: Ich wohne **bei** meinen Eltern. Ich arbeite **bei** Siemens.",
      "**mit** = zusammen mit, Verkehrsmittel: **mit dem** Bus. **nach** = Städte / Länder ohne Artikel, nach Hause, danach: **nach** Berlin.",
      "**zu** = zu Personen, Geschäften, Institutionen: **zum** Arzt, **zur** Post. **seit** = Zeitraum bis jetzt.",
      "Kurzformen: bei + dem = **beim**, von + dem = **vom**, zu + dem = **zum**, zu + der = **zur**.",
    ],
    tables: [],
    examples: ["Ich fahre **mit dem** Zug **zur** Arbeit.", "Sie kommt gerade **vom** Arzt.", "Ich lerne **seit einem** Jahr Deutsch.", "**Nach dem** Essen gehe ich spazieren."],
  },
  {
    cat: "praepositionen", level: "A2", title: "Wechselpräpositionen: Wo? oder Wohin?",
    intro: "Neun Präpositionen stehen mit **Dativ** oder **Akkusativ** – je nach Frage: **an, auf, hinter, in, neben, über, unter, vor, zwischen**.",
    rules: [
      "**Wo?** (Ort, Position, keine Richtung) → **Dativ**: Das Buch liegt **auf dem** Tisch.",
      "**Wohin?** (Richtung, Bewegung zu einem Ziel) → **Akkusativ**: Ich lege das Buch **auf den** Tisch.",
      "Verbpaare: **stellen** (Wohin? Akk.) / **stehen** (Wo? Dat.), **legen / liegen**, **setzen / sitzen**, **hängen / hängen**.",
      "Kurzformen: an + dem = **am**, in + dem = **im** (Dativ); an + das = **ans**, in + das = **ins** (Akkusativ).",
      "Zeit: **an, in, vor** + Dativ: **am** Montag, **im** Mai, **vor** zwei Tagen.",
    ],
    tables: [{ caption: "Beispiele", head: ["Wohin? (Akkusativ)", "Wo? (Dativ)"], rows: [
      ["Ich gehe in die Küche.", "Ich bin in der Küche."], ["Ich stelle die Flasche auf den Tisch.", "Die Flasche steht auf dem Tisch."],
      ["Ich hänge das Bild an die Wand.", "Das Bild hängt an der Wand."], ["Er setzt sich neben mich.", "Er sitzt neben mir."], ["Wir fahren ins Kino.", "Wir sind im Kino."]] }],
    examples: ["Die Katze schläft **unter dem** Bett.", "Die Katze läuft **unter das** Bett.", "Ich warte **vor dem** Kino.", "Das Bild hängt **zwischen den** Fenstern."],
  },
  {
    cat: "praepositionen", level: "A1", title: "Temporale Präpositionen (Zeit)",
    intro: "Für Zeitangaben benutzt man verschiedene Präpositionen – die wichtigsten muss man auswendig lernen.",
    rules: [
      "**um** + Uhrzeit: **um** 8 Uhr, **um** halb neun.",
      "**am** + Tag, Datum, Tageszeit, Wochenende: **am** Montag, **am** 3. Mai, **am** Abend, **am** Wochenende (Ausnahme: **in der** Nacht).",
      "**im** + Monat, Jahreszeit: **im** Mai, **im** Sommer. Jahre: ohne Präposition (2024) oder **im Jahr** 2024.",
      "**vor** + Dativ = in der Vergangenheit: **vor** drei Tagen. **in** + Dativ = in der Zukunft: **in** zwei Wochen.",
      "**seit** + Dativ = von einem Punkt in der Vergangenheit bis jetzt: **seit** einem Jahr (Verb im Präsens!).",
      "**ab** = Beginn (ab Montag), **bis** = Ende (bis Freitag), **von … bis**: **von** 9 **bis** 17 Uhr, **nach** = später als (**nach** dem Essen), **gegen** = ungefähr (**gegen** 8 Uhr).",
    ],
    tables: [],
    examples: ["Der Kurs beginnt **am** Montag **um** 9 Uhr.", "**Im** Winter fahren wir Ski.", "Ich wohne **seit** drei Jahren hier.", "**In** einer Woche habe ich Urlaub."],
  },
  {
    cat: "praepositionen", level: "A2", title: "Lokale Präpositionen: Wohin? Wo? Woher?",
    intro: "Ob man **in, nach, zu, bei, an, aus** oder **von** benutzt, hängt vom Ziel ab.",
    rules: [
      "Städte / Länder ohne Artikel: **nach** Berlin – **in** Berlin – **aus** Berlin.",
      "Länder mit Artikel: **in die** Schweiz – **in der** Schweiz – **aus der** Schweiz.",
      "Personen: **zum** Arzt – **beim** Arzt – **vom** Arzt.",
      "Gebäude / Räume: **in die** Schule – **in der** Schule – **aus der** Schule.",
      "Wasser / offene Orte: **an den** Strand / **ans** Meer – **am** Strand / **am** Meer – **vom** Strand.",
      "Zuhause: **nach** Hause (Wohin?) – **zu** Hause (Wo?) – **von zu** Hause (Woher?).",
    ],
    tables: [{ caption: "Übersicht", head: ["Ziel", "Wohin?", "Wo?", "Woher?"], rows: [
      ["Stadt / Land ohne Artikel", "nach Wien", "in Wien", "aus Wien"], ["Land mit Artikel", "in die Türkei", "in der Türkei", "aus der Türkei"],
      ["Person", "zu meiner Oma", "bei meiner Oma", "von meiner Oma"], ["Gebäude", "ins Kino", "im Kino", "aus dem Kino"],
      ["Wasser", "ans Meer", "am Meer", "vom Meer"], ["Zuhause", "nach Hause", "zu Hause", "von zu Hause"]] }],
    examples: ["Im Sommer fahren wir **nach** Italien.", "Ich gehe heute **zum** Friseur.", "Sie ist **beim** Arzt.", "Wir waren **am** See."],
  },
  {
    cat: "praepositionen", level: "B1", title: "Präpositionen mit Genitiv",
    intro: "Einige Präpositionen stehen mit dem **Genitiv** – besonders in geschriebener Sprache.",
    rules: [
      "B1: **wegen** (Grund), **trotz** (Gegengrund), **während** (Zeitraum), **(an)statt** (Alternative).",
      "B2: **innerhalb** / **außerhalb** (Ort, Zeit), **aufgrund** (Grund), **laut** (Quelle, auch mit Dativ).",
      "C1: **angesichts, hinsichtlich, infolge, mangels, zugunsten, ungeachtet, seitens, zwecks, kraft**.",
      "Im Gespräch hört man **wegen / trotz + Dativ**: wegen dem Regen (umgangssprachlich).",
    ],
    tables: [],
    examples: ["**Wegen des** schlechten Wetters bleiben wir zu Hause.", "**Trotz der** Kälte gehen wir spazieren.", "**Während des** Unterrichts ist das Handy aus.", "**Innerhalb einer** Woche bekommen Sie eine Antwort."],
  },

  // ======================= SATZBAU & KONNEKTOREN =======================
  {
    cat: "satzbau", level: "A1", title: "Hauptsatz: das Verb auf Position 2",
    intro: "Im deutschen Hauptsatz steht das konjugierte Verb **immer auf Position 2**.",
    rules: [
      "Position 1 kann das Subjekt sein – oder etwas anderes (Zeit, Ort, Objekt).",
      "Steht etwas anderes auf Position 1, kommt das Subjekt **direkt nach dem Verb** (Inversion).",
      "Position 1 kann auch aus mehreren Wörtern bestehen: **Am nächsten Montag** fahre ich nach Berlin.",
    ],
    tables: [{ caption: "Verb auf Position 2", head: ["Position 1", "Position 2 (Verb)", "Rest"], rows: [
      ["Ich", "gehe", "heute ins Kino."], ["Heute", "gehe", "ich ins Kino."], ["Ins Kino", "gehe", "ich heute."], ["Am Wochenende", "besuchen", "wir unsere Eltern."]] }],
    examples: ["Morgen **fahre** ich nach Hause.", "Meine Schwester **wohnt** in Wien.", "Um 7 Uhr **stehe** ich auf."],
  },
  {
    cat: "satzbau", level: "A1", title: "Satzklammer",
    intro: "Wenn ein Satz zwei Verbteile hat, bilden sie eine **Klammer**: Teil 1 auf Position 2, Teil 2 am **Satzende**.",
    rules: [
      "Modalverb + Infinitiv: Ich **muss** heute lange **arbeiten**.",
      "Perfekt: haben / sein + Partizip II: Ich **habe** gestern Fußball **gespielt**.",
      "Trennbares Verb: Ich **stehe** jeden Tag um 7 Uhr **auf**.",
      "Futur / Passiv: Er **wird** morgen **kommen**. Das Haus **wird** renoviert.",
    ],
    tables: [],
    examples: ["Wir **wollen** am Wochenende ins Kino **gehen**.", "Ich **habe** meine Hausaufgaben schon **gemacht**.", "Der Zug **kommt** um 9 Uhr **an**."],
  },
  {
    cat: "satzbau", level: "A1", title: "Fragen: W-Fragen und Ja/Nein-Fragen",
    intro: "Es gibt zwei Arten von Fragen.",
    rules: [
      "**W-Frage**: W-Wort (Position 1) + Verb (Position 2) + Subjekt: **Wo wohnst** du?",
      "W-Wörter: wer, was, wo, woher, wohin, wann, warum, wie, wie viel, welcher, wessen, wem, wen.",
      "**Ja/Nein-Frage**: das Verb steht auf **Position 1**: **Wohnst** du in Berlin? – Ja. / Nein.",
      "Antwort auf eine negative Frage: **doch** = Ja (trotz Negation): Kommst du nicht mit? – **Doch**, ich komme mit!",
    ],
    tables: [],
    examples: ["**Wie heißt** du?", "**Woher kommen** Sie?", "**Hast** du Zeit?", "Hast du keinen Hunger? – **Doch**!"],
  },
  {
    cat: "satzbau", level: "B1", title: "Wortstellung im Mittelfeld: TeKaMoLo",
    intro: "Zwischen Verb und Satzende (Mittelfeld) haben die Angaben eine typische Reihenfolge.",
    rules: [
      "**Te**mporal (wann?) – **Ka**usal (warum?) – **Mo**dal (wie?) – **Lo**kal (wo / wohin?).",
      "Zwei Nomen als Objekte: **Dativ vor Akkusativ**: Ich gebe **dem Kind den Ball**.",
      "Akkusativ als Pronomen: **Akkusativ vor Dativ**: Ich gebe **ihn dem Kind** / Ich gebe **ihn ihm**.",
      "Pronomen stehen früh im Satz, direkt nach dem Verb.",
    ],
    tables: [],
    examples: ["Ich fahre **morgen** **wegen der Arbeit** **mit dem Zug** **nach Berlin**.", "Sie hat **ihrer Mutter** **einen Brief** geschrieben.", "Ich zeige **es dir** morgen."],
  },
  {
    cat: "satzbau", level: "A1", title: "Konnektoren auf Position 0: und, aber, oder, denn, sondern",
    intro: "Diese Konnektoren verbinden zwei Hauptsätze. Sie stehen auf **Position 0** – die Wortstellung ändert sich **nicht**.",
    rules: [
      "**und** (plus), **aber** (Gegensatz), **oder** (Alternative), **denn** (Grund), **sondern** (Korrektur nach Negation). Merkwort: **ADUSO**.",
      "Nach dem Konnektor kommt Position 1, dann das Verb: …, **denn** ich **bin** müde.",
      "Vor aber, denn, sondern steht ein Komma; vor und / oder meist nicht.",
    ],
    tables: [{ caption: "Position 0", head: ["Hauptsatz 1", "Pos. 0", "Pos. 1", "Pos. 2 (Verb)", "Rest"], rows: [
      ["Ich bleibe zu Hause,", "denn", "ich", "bin", "krank."], ["Er ist nett,", "aber", "er", "hat", "keine Zeit."], ["Ich trinke Tee", "und", "sie", "trinkt", "Kaffee."]] }],
    examples: ["Ich komme mit, **aber** ich habe nur eine Stunde Zeit.", "Das ist nicht mein Bruder, **sondern** mein Freund.", "Möchtest du Tee **oder** Kaffee?"],
  },
  {
    cat: "satzbau", level: "A2", title: "Konnektoren auf Position 1: deshalb, trotzdem, dann …",
    intro: "Diese Wörter (Adverbien) stehen auf **Position 1**. Danach folgt sofort das **Verb**, dann das Subjekt.",
    rules: [
      "Folge: **deshalb, deswegen, darum, also, daher, folglich, somit**.",
      "Gegengrund: **trotzdem, dennoch, nichtsdestotrotz**.",
      "Zeit: **dann, danach, zuerst, später, anschließend**.",
      "Ergänzung / Alternative: **außerdem, sonst, allerdings, jedoch**.",
    ],
    tables: [{ caption: "Position 1", head: ["Hauptsatz 1", "Pos. 1", "Pos. 2 (Verb)", "Rest"], rows: [
      ["Ich bin krank,", "deshalb", "bleibe", "ich zu Hause."], ["Er ist müde,", "trotzdem", "geht", "er zur Arbeit."], ["Zuerst frühstücke ich,", "dann", "gehe", "ich zur Arbeit."]] }],
    examples: ["Es regnet, **deshalb nehme** ich einen Schirm mit.", "Das Hotel war teuer, **trotzdem hat** es uns gefallen.", "Beeil dich, **sonst verpassen** wir den Zug!"],
  },
  {
    cat: "satzbau", level: "A2", title: "Nebensätze: das Verb steht am Ende",
    intro: "Nebensätze beginnen mit einer Subjunktion (weil, dass, wenn, ob …). Das konjugierte Verb steht **ganz am Ende**.",
    rules: [
      "Grund: **weil, da** – Inhalt: **dass** – Bedingung: **wenn, falls** – indirekte Ja/Nein-Frage: **ob** – Gegengrund: **obwohl**.",
      "Trennbare Verben bleiben zusammen: …, weil ich früh **aufstehe**.",
      "Mehrere Verben: das konjugierte Verb steht ganz hinten: …, weil ich arbeiten **muss** / weil ich gearbeitet **habe**.",
      "Steht der Nebensatz **zuerst**, beginnt der Hauptsatz mit dem **Verb**: **Weil** ich krank bin, **bleibe** ich zu Hause.",
      "Indirekte W-Fragen funktionieren genauso: Kannst du mir sagen, **wo** der Bahnhof **ist**?",
    ],
    tables: [{ caption: "Nebensatz", head: ["Hauptsatz", "Subjunktion", "Mittelfeld", "Verb (Ende)"], rows: [
      ["Ich bleibe zu Hause,", "weil", "ich krank", "bin."], ["Ich glaube,", "dass", "er morgen", "kommt."], ["Ich weiß nicht,", "ob", "sie Zeit", "hat."], ["Er geht zur Arbeit,", "obwohl", "er müde", "ist."]] }],
    examples: ["Ich lerne Deutsch, **weil** ich in Deutschland arbeiten **möchte**.", "**Wenn** es regnet, **bleiben** wir zu Hause.", "Weißt du, **ob** der Supermarkt noch offen **ist**?"],
  },
  {
    cat: "satzbau", level: "B1", title: "Temporale Nebensätze: als, wenn, während, bevor, nachdem …",
    intro: "Temporale Subjunktionen sagen, **wann** etwas passiert. Auch hier steht das Verb am Ende.",
    rules: [
      "**als** = einmaliges Ereignis oder Zeitraum in der **Vergangenheit**: **Als** ich ein Kind war, …",
      "**wenn** = Gegenwart / Zukunft oder **wiederholt** in der Vergangenheit (immer wenn): **Wenn** ich Zeit habe, …",
      "**während** = gleichzeitig. **bevor** = die Handlung im Nebensatz kommt **später**.",
      "**nachdem** = die Handlung im Nebensatz kommt **früher** (Zeitenwechsel: Plusquamperfekt → Präteritum / Perfekt → Präsens).",
      "**seit(dem)** = von einem Zeitpunkt bis jetzt, **bis** = zeitliches Ende, **sobald** = direkt danach, **solange** = während der ganzen Zeit.",
    ],
    tables: [],
    examples: ["**Als** ich in Berlin **ankam**, regnete es.", "**Immer wenn** ich sie **besuche**, kocht sie für mich.", "**Bevor** ich esse, wasche ich mir die Hände.", "**Nachdem** er gegessen **hatte**, ging er spazieren."],
  },
  {
    cat: "satzbau", level: "B1", title: "Finalsätze: um … zu und damit",
    intro: "Mit **um … zu** und **damit** sagt man, welches **Ziel** oder welchen **Zweck** eine Handlung hat (Frage: Wozu?).",
    rules: [
      "**um … zu + Infinitiv**: nur wenn das Subjekt in beiden Teilen **gleich** ist: Ich lerne, **um** die Prüfung **zu bestehen**.",
      "**damit** + Nebensatz: immer möglich, **nötig** bei verschiedenen Subjekten: Ich erkläre es langsam, **damit** du es **verstehst**.",
      "Keine Modalverben wollen / möchten im damit-Satz.",
    ],
    tables: [],
    examples: ["Ich spare Geld, **um** ein Auto **zu kaufen**.", "Er spricht laut, **damit** alle ihn **hören**.", "Wir fahren früh los, **um** den Stau **zu vermeiden**."],
  },
  {
    cat: "satzbau", level: "B2", title: "Doppelkonnektoren",
    intro: "Doppelkonnektoren bestehen aus zwei Teilen und verbinden Wörter oder Sätze.",
    rules: [
      "**sowohl … als auch** = beides: Er spricht **sowohl** Deutsch **als auch** Englisch.",
      "**weder … noch** = keins von beiden: Ich habe **weder** Zeit **noch** Geld.",
      "**entweder … oder** = eins von beiden: **Entweder** kommst du mit **oder** du bleibst hier.",
      "**nicht nur … sondern auch** = beides (Betonung auf dem zweiten): Sie ist **nicht nur** klug, **sondern auch** fleißig.",
      "**zwar … aber** = Einschränkung: Das Auto ist **zwar** alt, **aber** es fährt gut.",
      "**je + Komparativ …, desto / umso + Komparativ …**: **Je** mehr ich übe, **desto** besser spreche ich. (je-Satz: Verb am Ende; desto-Satz: Verb direkt danach)",
      "**einerseits … andererseits** = zwei Seiten einer Sache.",
    ],
    tables: [],
    examples: ["**Je** länger ich in Deutschland lebe, **desto** besser verstehe ich die Kultur.", "Ich trinke **weder** Kaffee **noch** Tee.", "**Einerseits** verdient er gut, **andererseits** hat er kaum Freizeit."],
  },
  {
    cat: "satzbau", level: "B2", title: "Bedingung, Gegengrund und Gegensatz",
    intro: "Für Bedingungen, Gegengründe und Gegensätze gibt es Konnektoren auf mehreren Niveaus.",
    rules: [
      "Bedingung: **wenn, falls** (B1/B2), **sofern** (C1) + Nebensatz. Ausnahme: **es sei denn** (= außer wenn) + Hauptsatz-Wortstellung.",
      "Gegengrund (konzessiv): Nebensatz **obwohl** (B1), **obgleich, wenngleich** (C1) – Adverb **trotzdem, dennoch, nichtsdestotrotz** – Präposition **trotz** + Genitiv.",
      "Gegensatz (adversativ): **während, wohingegen** + Nebensatz – **hingegen, dagegen** als Adverb.",
      "Folge (konsekutiv): **sodass / so …, dass** + Nebensatz – **folglich, somit, demzufolge** als Adverb.",
      "Grund (kausal): **weil, da** + Nebensatz – **denn** (Position 0) – **nämlich** (im Mittelfeld) – **wegen, aufgrund** + Genitiv.",
    ],
    tables: [{ caption: "Gleiche Bedeutung – drei Formen", head: ["Nebensatz", "Adverb", "Präposition"], rows: [
      ["Obwohl es regnet, gehen wir spazieren.", "Es regnet. Trotzdem gehen wir spazieren.", "Trotz des Regens gehen wir spazieren."],
      ["Weil es regnet, bleiben wir zu Hause.", "Es regnet. Deshalb bleiben wir zu Hause.", "Wegen des Regens bleiben wir zu Hause."]] }],
    examples: ["**Falls** du Hilfe brauchst, ruf mich an.", "Ich komme morgen, **es sei denn**, ich werde krank.", "Er arbeitet viel, **wohingegen** sein Bruder faul ist.", "Es war so kalt, **dass** wir zu Hause blieben."],
  },
];
