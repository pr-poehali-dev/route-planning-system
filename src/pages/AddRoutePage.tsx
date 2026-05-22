import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const EXAMPLE_TEXT = `Владивосток-Москва 25*3,5*4,5 (Просушка)
Артем-Хабаровск 43.360614, 132.071020- 48.337294, 135.044431(8т на ось)
Хабаровск-Танга 48.546969, 135.034325- 50.962880, 111.070861(10т на ось)
ТангаОМНИ-Ишим 50.964019, 110.962836- 56.159897, 69.549777
Абатское-Каменск-Уральский 56.280508, 70.439126- 56.333392, 62.250293`;

interface Segment {
  name: string;
  from: string;
  to: string;
  condition: string;
}

interface ParsedRoute {
  name: string;
  dimensions: { length: string; width: string; height: string };
  condition: string;
  segments: Segment[];
}

function parseRouteText(text: string): ParsedRoute | null {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 1) return null;

  // First line: "НазваниеМаршрута ДхШхВ (Условие)"
  const firstLine = lines[0].trim();
  const dimMatch = firstLine.match(/^(.+?)\s+([\d,.]+)[*хx×]([\d,.]+)[*хx×]([\d,.]+)\s*(?:\(([^)]*)\))?$/);

  let routeName = '';
  let dims = { length: '', width: '', height: '' };
  let routeCondition = '';

  if (dimMatch) {
    routeName = dimMatch[1].trim();
    dims = { length: dimMatch[2], width: dimMatch[3], height: dimMatch[4] };
    routeCondition = dimMatch[5] || '';
  } else {
    // Try without dims
    const simpleMatch = firstLine.match(/^(.+?)(?:\s*\(([^)]*)\))?$/);
    if (simpleMatch) {
      routeName = simpleMatch[1].trim();
      routeCondition = simpleMatch[2] || '';
    }
  }

  // Rest of lines: segments
  const segments: Segment[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Pattern: "НазваниеУчастка lat1, lon1- lat2, lon2(условие)"
    const segMatch = line.match(
      /^(.+?)\s+([\d.]+),?\s*([\d.]+)\s*[-–]\s*([\d.]+),?\s*([\d.]+)\s*(?:\(([^)]*)\))?$/
    );
    if (segMatch) {
      segments.push({
        name: segMatch[1].trim(),
        from: `${segMatch[2]}, ${segMatch[3]}`,
        to: `${segMatch[4]}, ${segMatch[5]}`,
        condition: segMatch[6] || '',
      });
    } else {
      // Line without coords — just a named segment
      const namedMatch = line.match(/^(.+?)(?:\s*\(([^)]*)\))?$/);
      if (namedMatch) {
        segments.push({ name: namedMatch[1].trim(), from: '', to: '', condition: namedMatch[2] || '' });
      }
    }
  }

  return { name: routeName, dimensions: dims, condition: routeCondition, segments };
}

export default function AddRoutePage() {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedRoute | null>(null);
  const [parseError, setParseError] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');

  const handleParse = useCallback(() => {
    if (!rawText.trim()) return;
    const result = parseRouteText(rawText);
    if (result && result.name) {
      setParsed(result);
      setParseError('');
      setActiveTab('preview');
    } else {
      setParseError('Не удалось распознать формат. Проверьте пример.');
      setParsed(null);
    }
  }, [rawText]);

  const handleInsertExample = () => {
    setRawText(EXAMPLE_TEXT);
    setParsed(null);
    setParseError('');
    setActiveTab('input');
  };

  const handleSave = () => {
    if (!parsed) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const hasDims = parsed && (parsed.dimensions.length || parsed.dimensions.width || parsed.dimensions.height);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="font-oswald text-2xl font-bold text-foreground tracking-wide mb-1">Добавление маршрута</h2>
        <p className="text-muted-foreground font-golos text-sm">Вставьте данные маршрута в текстовом виде</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input column */}
        <div className="lg:col-span-3 space-y-4">

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {(['input', 'preview'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-golos font-medium transition-all ${
                  activeTab === tab ? 'gradient-orange text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab === 'input' ? 'FileText' : 'Eye'} size={15} />
                {tab === 'input' ? 'Ввод данных' : 'Предпросмотр'}
                {tab === 'preview' && parsed && (
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'input' && (
            <div className="card-dark rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">
                  Текст маршрута
                </label>
                <button
                  onClick={handleInsertExample}
                  className="text-xs text-primary hover:text-yellow-400 transition-colors font-golos flex items-center gap-1"
                >
                  <Icon name="Copy" size={12} />
                  Вставить пример
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={e => { setRawText(e.target.value); setParsed(null); setParseError(''); }}
                placeholder={`Владивосток-Москва 25*3,5*4,5 (Просушка)\nАртем-Хабаровск 43.360614, 132.071020- 48.337294, 135.044431(8т на ось)\nХабаровск-Танга 48.546969, 135.034325- 50.962880, 111.070861(10т на ось)`}
                className="w-full h-52 px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground/50 border border-border focus:outline-none focus:border-primary transition-colors font-mono text-sm resize-none leading-relaxed"
              />

              {parseError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Icon name="AlertCircle" size={14} className="text-destructive flex-shrink-0" />
                  <span className="text-xs text-destructive font-golos">{parseError}</span>
                </div>
              )}

              <button
                onClick={handleParse}
                disabled={!rawText.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-golos font-semibold text-sm transition-all ${
                  rawText.trim()
                    ? 'gradient-orange text-background hover:opacity-90 glow-orange-sm'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <Icon name="Scan" size={16} />
                Распознать маршрут
              </button>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4 animate-fade-in">
              {!parsed ? (
                <div className="card-dark rounded-xl p-10 flex flex-col items-center gap-3 text-center">
                  <Icon name="FileSearch" size={36} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-golos">Введите данные и нажмите «Распознать маршрут»</p>
                </div>
              ) : (
                <>
                  {/* Route header card */}
                  <div className="card-dark rounded-xl overflow-hidden">
                    <div className="gradient-orange px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background/20 rounded-xl flex items-center justify-center">
                          <Icon name="Navigation" size={20} className="text-background" />
                        </div>
                        <div>
                          <p className="font-oswald text-lg font-bold text-background leading-tight">{parsed.name}</p>
                          {parsed.condition && (
                            <span className="inline-block mt-1 text-xs bg-background/20 text-background px-2 py-0.5 rounded-md font-golos">
                              {parsed.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasDims && (
                      <div className="px-5 py-4 border-t border-border">
                        <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-3">Габариты транспорта</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Длина', value: parsed.dimensions.length, unit: 'м', icon: 'ArrowLeftRight' },
                            { label: 'Ширина', value: parsed.dimensions.width, unit: 'м', icon: 'ArrowLeftRight' },
                            { label: 'Высота', value: parsed.dimensions.height, unit: 'м', icon: 'ArrowUp' },
                          ].map(d => (
                            <div key={d.label} className="bg-muted rounded-xl p-3 text-center">
                              <Icon name={d.icon} size={14} className="text-primary mx-auto mb-1" />
                              <p className="font-oswald text-lg font-bold text-foreground">{d.value}<span className="text-xs font-golos text-muted-foreground ml-1">{d.unit}</span></p>
                              <p className="text-xs text-muted-foreground font-golos">{d.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Segments */}
                  <div className="card-dark rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Route" size={16} className="text-primary" />
                        <span className="font-oswald text-sm font-semibold text-foreground tracking-wide">Участки маршрута</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-golos bg-muted px-2 py-1 rounded-lg">
                        {parsed.segments.length} уч.
                      </span>
                    </div>

                    <div className="divide-y divide-border">
                      {parsed.segments.map((seg, i) => (
                        <div key={i} className="px-5 py-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                          {/* Number + line */}
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              i === 0 ? 'bg-green-500/20 text-green-400' :
                              i === parsed.segments.length - 1 ? 'bg-red-500/20 text-red-400' :
                              'bg-primary/20 text-primary'
                            }`}>
                              {i + 1}
                            </div>
                            {i < parsed.segments.length - 1 && (
                              <div className="w-0.5 h-4 bg-border rounded-full" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <p className="font-golos font-semibold text-sm text-foreground">{seg.name}</p>
                              {seg.condition && (
                                <span className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-md font-golos flex-shrink-0">
                                  {seg.condition}
                                </span>
                              )}
                            </div>
                            {(seg.from || seg.to) && (
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                {seg.from && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                                    <Icon name="MapPin" size={10} className="text-green-400 flex-shrink-0" />
                                    {seg.from}
                                  </span>
                                )}
                                {seg.from && seg.to && (
                                  <Icon name="ArrowRight" size={12} className="text-muted-foreground flex-shrink-0" />
                                )}
                                {seg.to && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                                    <Icon name="MapPin" size={10} className="text-red-400 flex-shrink-0" />
                                    {seg.to}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 py-3 gradient-orange rounded-xl font-golos font-semibold text-sm text-background hover:opacity-90 transition-all glow-orange-sm"
                  >
                    {saved
                      ? <><Icon name="CheckCircle" size={16} />Маршрут сохранён!</>
                      : <><Icon name="Save" size={16} />Сохранить маршрут</>
                    }
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right — format guide */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="BookOpen" size={16} className="text-yellow-400" />
              <span className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Формат ввода</span>
            </div>

            <div className="space-y-4">
              {/* Line 1 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md gradient-orange flex items-center justify-center text-xs font-bold text-background">1</span>
                  <p className="text-xs font-golos font-semibold text-foreground">Маршрут и габариты</p>
                </div>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary">Назв-Назв</span>
                  {' '}
                  <span className="text-yellow-400">Д*Ш*В</span>
                  {' '}
                  <span className="text-green-400">(условие)</span>
                </div>
                <p className="text-xs text-muted-foreground font-golos mt-1.5">Название маршрута, затем габариты через <code className="text-primary">*</code>, затем условие в скобках</p>
              </div>

              <div className="h-px bg-border" />

              {/* Line 2+ */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">2+</span>
                  <p className="text-xs font-golos font-semibold text-foreground">Участки (каждый с новой строки)</p>
                </div>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary">Назв-Назв</span>
                  {' '}
                  <span className="text-yellow-400">lat, lon</span>
                  <span className="text-muted-foreground">- </span>
                  <span className="text-yellow-400">lat, lon</span>
                  <span className="text-green-400">(условие)</span>
                </div>
                <p className="text-xs text-muted-foreground font-golos mt-1.5">Название, координаты начала через дефис координаты конца, условие в скобках</p>
              </div>

              <div className="h-px bg-border" />

              {/* Example */}
              <div>
                <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-2">Пример</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs leading-relaxed space-y-1">
                  <p><span className="text-foreground">Влад-Москва</span> <span className="text-yellow-400">25*3,5*4,5</span> <span className="text-green-400">(Просушка)</span></p>
                  <p><span className="text-foreground">Артем-Хабаровск</span> <span className="text-yellow-400">43.36, 132.07</span><span className="text-muted-foreground">- </span><span className="text-yellow-400">48.33, 135.04</span><span className="text-green-400">(8т на ось)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Условия */}
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="AlertTriangle" size={16} className="text-primary" />
              <span className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Типы условий</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Просушка', desc: 'Ограничение в период просушки дорог' },
                { label: '8т на ось', desc: 'Ограничение нагрузки на ось' },
                { label: '10т на ось', desc: 'Повышенная нагрузка на ось' },
                { label: 'Сезонный', desc: 'Сезонные ограничения движения' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs bg-primary/15 text-primary px-2 py-0.5 rounded font-golos font-medium flex-shrink-0">{c.label}</span>
                  <p className="text-xs text-muted-foreground font-golos leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}