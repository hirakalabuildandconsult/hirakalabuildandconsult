// [question, options, correct option index, explanation]
const fallbackQs = [
['Workability of fresh concrete is measured by?', ['Slump test','CBR test','Los Angeles test','Sieve analysis'],0,'Slump is the common site test for concrete workability.'],
['Which instrument measures horizontal and vertical angles?', ['Level','Theodolite','Planimeter','Chain'],1,'A theodolite measures both horizontal and vertical angles.'],
['The usual binding material in RCC is?', ['Bitumen','Cement','Lime','Gypsum'],1,'Cement binds the concrete matrix.'],
['CBR in pavement design indicates?', ['Concrete strength','Subgrade strength','Steel grade','Water quality'],1,'CBR is used to evaluate subgrade support.'],
['The SI unit of stress is?', ['Newton','Pascal','Joule','Watt'],1,'Stress is force per unit area, measured in pascals.'],
['Contour lines join points of equal?', ['Slope','Elevation','Distance','Pressure'],1,'Every point on one contour has the same elevation.'],
['A BOQ primarily lists?', ['Workers','Quantities of work','Equipment','Drawings'],1,'A bill of quantities describes and measures construction work.'],
['A common cement soundness test uses?', ['Le Chatelier apparatus','Slump cone','Vicat needle','CBR mould'],0,'Le Chatelier apparatus checks excessive expansion.'],
['Revit is mainly used for?', ['BIM','Road rolling','Concrete mixing','Soil drilling'],0,'Revit is a Building Information Modelling tool.'],
['A foundation transfers building load safely to?', ['Roof','Soil','Plaster','Beam'],1,'Foundations transmit structural load to the ground.'],
['Camber is provided on roads for?', ['Drainage','Lighting','Parking','Speed'],0,'Camber drains rainwater from the pavement surface.'],
['Main tensile reinforcement in a simply supported slab lies near?', ['Top','Bottom','Centre','Sides'],1,'Gravity loading causes tension at the bottom at midspan.'],
['A benchmark in surveying has known?', ['Elevation','Area','Cost','Speed'],0,'A benchmark is a fixed point with known elevation.'],
['Which material improves concrete tensile capacity?', ['Reinforcement steel','Sand','Water','Aggregate'],0,'Steel carries tensile forces in reinforced concrete.'],
['Hydraulic gradient is head loss per?', ['Unit length','Unit volume','Unit time','Unit weight'],0,'It is the loss of head divided by the flow path length.'],
['A tender document supports?', ['Procurement','Painting','Excavation only','Survey calibration'],0,'Tender documents obtain competitive offers for work.'],
['The ratio of water to cement is called?', ['Water-cement ratio','Fineness modulus','Void ratio','Poisson ratio'],0,'Water-cement ratio strongly affects strength and workability.'],
['ETABS is mainly used for?', ['Building analysis','Land valuation','Water testing','Road signs'],0,'ETABS is used for structural analysis and design of buildings.'],
['Retaining walls resist?', ['Lateral earth pressure','Rainfall only','Wind only','Heat'],0,'They retain soil at different ground levels.'],
['The purpose of curing concrete is to?', ['Maintain moisture','Increase sand','Remove steel','Add colour'],0,'Curing enables hydration and strength gain.'],
['Specific gravity is the ratio of a material density to?', ['Water density','Air density','Cement density','Steel density'],0,'It compares a material density with water density.'],
['The initial setting time of OPC should not be less than?', ['10 minutes','30 minutes','60 minutes','90 minutes'],1,'OPC should have an initial setting time of at least 30 minutes.'],
['Which aggregate is retained on a 4.75 mm sieve?', ['Fine aggregate','Coarse aggregate','Silt','Clay'],1,'Coarse aggregate is retained on the 4.75 mm sieve.'],
['Fineness modulus is an index of?', ['Aggregate particle size','Cement strength','Steel ductility','Soil moisture'],0,'It gives an indication of average aggregate particle size.'],
['Bulking occurs mainly in?', ['Moist sand','Dry gravel','Cement paste','Steel'],0,'Moisture films cause sand volume to increase.'],
['The nominal cover in RCC protects steel from?', ['Corrosion and fire','Bending only','Settlement only','Shrinkage only'],0,'Concrete cover improves durability and fire resistance.'],
['Which test measures concrete compressive strength?', ['Cube test','Slump test','Abrasion test','Sieve test'],0,'Concrete cubes are commonly crushed to determine strength.'],
['M20 concrete has characteristic compressive strength of?', ['10 MPa','20 MPa','30 MPa','40 MPa'],1,'The number in M20 represents 20 MPa at 28 days.'],
['Concrete is strongest in?', ['Compression','Tension','Torsion','Impact'],0,'Concrete has high compressive strength but low tensile strength.'],
['A construction joint is provided when?', ['Concreting stops','Steel is cut','Survey begins','Soil is tested'],0,'It is formed where one concrete placement ends and another begins.'],
['The neutral axis in a beam is where?', ['Stress is zero','Shear is maximum','Moment is zero','Deflection is maximum'],0,'Longitudinal bending stress is zero at the neutral axis.'],
['A simply supported beam has?', ['Pin and roller supports','Two fixed ends','One free end','No supports'],0,'The standard model has a pin at one end and roller at the other.'],
['The bending moment at a simple support is usually?', ['Zero','Maximum','Negative infinity','Equal to shear'],0,'A pin or roller support does not resist moment.'],
['Shear force is the algebraic sum of?', ['Vertical forces','Horizontal forces','Moments only','Temperatures'],0,'Shear force is obtained from vertical loads on one side of a section.'],
['A cantilever beam is fixed at?', ['One end only','Both ends','Neither end','Its centre'],0,'A cantilever projects from a single fixed support.'],
['Which section shape is efficient in bending?', ['I-section','Solid circle only','Square block only','Flat plate only'],0,'I-sections place more material away from the neutral axis.'],
['Young’s modulus is the ratio of?', ['Stress to strain','Load to area','Moment to shear','Force to time'],0,'Within elastic range, E equals stress divided by strain.'],
['Poisson’s ratio relates?', ['Lateral strain to longitudinal strain','Stress to load','Weight to volume','Moment to area'],0,'It is the ratio of lateral strain to longitudinal strain.'],
['Buckling is most associated with?', ['Slender columns','Short beams','Thick slabs','Footings'],0,'Slender compression members can buckle before crushing.'],
['A column mainly carries?', ['Axial compression','Pure tension','Hydraulic pressure','Heat'],0,'Columns transfer primarily compressive axial loads.'],
['Stirrups in an RCC beam mainly resist?', ['Shear','Deflection only','Shrinkage only','Temperature only'],0,'Stirrups provide shear reinforcement and hold main bars.'],
['A slab is generally classified as one-way when Ly/Lx is?', ['Greater than 2','Equal to 1','Less than 1','Zero'],0,'One-way action predominates when the long-to-short span ratio exceeds 2.'],
['A two-way slab transfers load in?', ['Two directions','One direction only','Vertical direction only','No direction'],0,'Two-way slabs span and distribute load in both directions.'],
['The centre of gravity of a triangle lies at?', ['One-third of height from base','Half the height','One-fourth the height','At a vertex'],0,'It lies on each median, one-third from the base.'],
['Moment equals force multiplied by?', ['Perpendicular distance','Area','Time','Density'],0,'Moment is force times its perpendicular lever arm.'],
['A uniformly distributed load is expressed in?', ['kN/m','kN','kN/m2 only','m/kN'],0,'A line load is force per unit length.'],
['A point load is expressed in?', ['kN','kN/m','kN/m2','m2/kN'],0,'A concentrated load is a force.'],
['The standard unit of density is?', ['kg/m3','kg/m2','N/m','m3/kg'],0,'Density is mass per unit volume.'],
['Compaction of soil primarily reduces?', ['Air voids','Soil solids','Particle size','Specific gravity'],0,'Mechanical compaction expels air and increases density.'],
['Optimum moisture content is determined by?', ['Proctor test','Slump test','CBR test','Vicat test'],0,'The Proctor test gives OMC and maximum dry density.'],
['Atterberg limits are used for?', ['Fine-grained soils','Steel sections','Concrete cubes','Timber joints'],0,'They describe consistency of fine soils.'],
['Liquid limit is the boundary between?', ['Plastic and liquid states','Solid and semi-solid states','Dry and wet concrete','Sand and gravel'],0,'It is the water content at the plastic-liquid boundary.'],
['Plasticity index equals?', ['Liquid limit minus plastic limit','Plastic limit minus liquid limit','Water content minus void ratio','Density minus moisture'],0,'PI is LL minus PL.'],
['A well-graded soil has?', ['Wide range of particle sizes','One particle size only','Only clay','Only organic matter'],0,'A broad particle-size distribution improves packing.'],
['Sieve analysis is used to find?', ['Particle-size distribution','Cement setting time','Concrete slump','Steel strength'],0,'Sieves separate aggregate or soil particles by size.'],
['Permeability is the ability of soil to?', ['Transmit water','Carry vehicles','Resist fire','Reflect light'],0,'Permeability describes water flow through voids.'],
['Effective stress equals?', ['Total stress minus pore pressure','Total stress plus pore pressure','Pore pressure only','Shear stress only'],0,'Pore water pressure reduces stress carried by soil skeleton.'],
['Consolidation settlement is significant in?', ['Saturated clay','Dry gravel','Steel','Concrete'],0,'Clay settles slowly as pore water drains.'],
['The bearing capacity of soil is its ability to?', ['Support foundation load','Absorb water only','Hold cement','Measure angles'],0,'It is the capacity to carry load without shear failure or excessive settlement.'],
['A shallow foundation is commonly used when competent soil is?', ['Near the surface','Very deep','Absent','Under water only'],0,'Shallow footings are economical when good bearing strata are near ground level.'],
['A pile foundation transfers load to?', ['Deeper strata','Roof slab','Plaster coat','Road surface'],0,'Piles carry loads to deeper soil or rock.'],
['A total station combines electronic distance measurement with?', ['Angle measurement','Concrete mixing','Soil compaction','Water pumping'],0,'It measures angles and distances electronically.'],
['Levelling is used to determine?', ['Difference in elevation','Magnetic bearing','Concrete strength','Road width'],0,'Levelling establishes relative heights.'],
['A backsight is taken on?', ['Known point','Unknown point only','A building roof','A random line'],0,'A backsight on a known elevation establishes instrument height.'],
['A foresight is usually the last reading before?', ['Moving the instrument','Starting excavation','Mixing concrete','Issuing a tender'],0,'A foresight is taken before the level is shifted.'],
['The horizontal angle measured clockwise from north is?', ['Bearing','Gradient','Camber','Offset'],0,'Bearing is the direction of a line from a reference meridian.'],
['The scale of a map is the ratio of?', ['Map distance to ground distance','Ground distance to map area','Height to width','Time to speed'],0,'Scale relates drawing measurements to actual measurements.'],
['A contour interval is the vertical distance between?', ['Consecutive contours','Two stations','Two buildings','Two bearings'],0,'It is the fixed elevation difference between contour lines.'],
['Chain surveying is best suited for?', ['Small open areas','Dense forests','Very large cities','Deep water'],0,'It is simple and suitable for relatively level, open ground.'],
['An offset in chain surveying is measured from?', ['Survey line','Benchmark only','North line only','Contour line'],0,'Offsets locate details from the main survey line.'],
['The purpose of a traverse is to?', ['Establish control points','Mix mortar','Cure concrete','Test steel'],0,'Traverses provide a sequence of measured control lines.'],
['Road pavement layers distribute wheel load to?', ['Subgrade','Roof','Drain','Footpath only'],0,'Pavement layers spread traffic loads to the subgrade.'],
['The top layer of a flexible pavement is?', ['Wearing course','Subgrade','Sub-base','Embankment'],0,'The wearing course directly receives traffic.'],
['Bitumen is mainly used as?', ['Binder in flexible pavement','Reinforcement in RCC','Fine aggregate','Survey marker'],0,'Bitumen binds aggregate in asphalt layers.'],
['Rigid pavement is generally made of?', ['Cement concrete','Bituminous mix','Clay','Timber'],0,'Rigid pavements use Portland cement concrete slabs.'],
['Superelevation is provided on horizontal curves to counter?', ['Centrifugal force','Gravity only','Rainfall only','Shrinkage'],0,'It helps balance lateral force on vehicles.'],
['Gradient on a road is the rate of change of?', ['Elevation along length','Width along time','Cost along area','Speed along load'],0,'It expresses longitudinal slope.'],
['A culvert carries water?', ['Under a road or embankment','Over a high-rise','Through a beam','Inside a column'],0,'Culverts provide cross-drainage beneath roads.'],
['The main purpose of road drainage is to?', ['Remove surface and subsurface water','Increase camber only','Increase traffic','Reduce signs'],0,'Good drainage protects pavement and earthworks.'],
['Brick masonry is usually laid in?', ['Mortar','Bitumen only','Water','Paint'],0,'Mortar bonds bricks and fills joints.'],
['English bond consists of?', ['Alternate header and stretcher courses','Only stretcher courses','Only header courses','Random bricks'],0,'English bond alternates full header and stretcher courses.'],
['The standard modular brick has which general shape?', ['Rectangular prism','Sphere','Cone','Cylinder'],0,'Bricks are rectangular units for masonry.'],
['Plaster is applied mainly to?', ['Protect and finish surfaces','Increase foundation depth','Measure angles','Compact soil'],0,'Plaster gives a protective and decorative finish.'],
['DPC prevents?', ['Rising dampness','Concrete curing','Road camber','Steel welding'],0,'A damp-proof course blocks moisture rising through walls.'],
['A staircase riser is the?', ['Vertical part of a step','Horizontal part of a step','Handrail only','Landing only'],0,'The tread is horizontal; the riser is vertical.'],
['A lintel is provided above?', ['Door or window opening','Foundation base','Roof tile','Drain pipe'],0,'Lintels carry wall load over openings.'],
['A weep hole in a retaining wall relieves?', ['Water pressure','Wind pressure','Concrete shrinkage','Traffic load'],0,'It allows water to drain and reduces hydrostatic pressure.'],
['BIM improves projects through?', ['Coordinated digital information','Manual drafting only','More paperwork','Less planning'],0,'BIM coordinates model information among disciplines.'],
['AutoCAD is primarily used for?', ['2D drafting','Concrete curing','Pile driving','Water testing'],0,'AutoCAD is widely used for technical drafting.'],
['A Gantt chart shows?', ['Project schedule over time','Soil grading','Concrete strength','Land contour'],0,'It visualizes tasks and their planned durations.'],
['Critical path is the sequence that determines?', ['Minimum project duration','Paint colour','Soil density','Beam size only'],0,'Delays on the critical path delay the project completion.'],
['Rate analysis is used to determine?', ['Unit cost of an item','Concrete slump','Road gradient','Survey bearing'],0,'It breaks an item into materials, labour, plant and overhead costs.'],
['An estimate prepared before work begins is called?', ['Preliminary estimate','Final bill','Completion certificate','As-built drawing'],0,'A preliminary estimate gives an early project cost indication.'],
['A bar bending schedule lists?', ['Reinforcement details','Brick colours','Soil limits','Road signs'],0,'It schedules bar sizes, shapes, lengths and quantities.'],
['The purpose of site safety PPE is to?', ['Protect workers','Measure loads','Increase cement strength','Draw plans'],0,'Personal protective equipment reduces exposure to hazards.'],
['A safety helmet protects against?', ['Head injury','Foot injury only','Noise only','Dust only'],0,'Helmets protect the head from impact and falling objects.'],
['Scaffolding provides?', ['Temporary working platform','Permanent foundation','Survey benchmark','Concrete admixture'],0,'Scaffolding gives access for construction and maintenance work.'],
['Quality control on site means?', ['Checking work meets requirements','Increasing project cost','Removing inspections','Avoiding drawings'],0,'Quality control verifies compliance with drawings, specifications and standards.'],
['As-built drawings show?', ['Final constructed condition','Only initial concept','Tender price only','Soil test values only'],0,'They record the works as actually completed.'],
['The first step before construction is generally?', ['Planning and site investigation','Painting','Demolition always','Final billing'],0,'Planning and investigation establish a sound basis for design and execution.']
];

let qs = fallbackQs;
let i = 0;
let answers = [];

function draw() {
  const question = qs[i];
  const selected = answers[i];
  const quiz = document.getElementById('quiz');
  if (!quiz) return;
  const options = question[1].map((option, index) => {
    const isCorrect = index === question[2];
    const isSelected = selected === index;
    const state = selected === undefined ? '' : isCorrect ? 'correct' : isSelected ? 'incorrect' : '';
    const mark = selected === undefined ? '' : isCorrect ? '<span class="answer-mark" aria-label="Correct answer">&check;</span>' : isSelected ? '<span class="answer-mark" aria-label="Incorrect answer">&times;</span>' : '';
    return `<button class="option ${state} ${isSelected ? 'selected' : ''}" type="button" onclick="pick(${index})">${'ABCD'[index]}. ${option}${mark}</button>`;
  }).join('');
  const feedback = selected === undefined ? '' : `<div class="answer-feedback"><strong>${selected === question[2] ? 'Correct!' : 'Correct answer marked with a tick.'}</strong> ${question[3]}</div>`;
  quiz.innerHTML = `<div class="quiz-progress"><span class="tag">Question ${i + 1} of ${qs.length}</span><span>${Math.round(((i + 1) / qs.length) * 100)}% complete</span></div><div class="quiz-meter"><span style="width:${((i + 1) / qs.length) * 100}%"></span></div><p class="question">${question[0]}</p><div class="options">${options}</div>${feedback}<div class="hero-actions"><button class="btn btn-outline" type="button" onclick="prev()" ${i === 0 ? 'disabled' : ''}>Previous</button><button class="btn" type="button" onclick="next()">${i === qs.length - 1 ? 'Submit & Show Result' : 'Next Question'}</button></div>`;
}

function pick(index) { answers[i] = index; draw(); }
function prev() { if (i > 0) i -= 1; draw(); }
function next() {
  if (i < qs.length - 1) { i += 1; draw(); return; }
  const correct = answers.reduce((total, answer, index) => total + (answer === qs[index][2] ? 1 : 0), 0);
  const percentage = Math.round((correct / qs.length) * 100);
  document.getElementById('quiz').innerHTML = `<div class="result"><h2>${percentage >= 85 ? 'Excellent work' : percentage >= 60 ? 'Good effort' : 'Keep practising'} - ${percentage}%</h2><p>Total questions: ${qs.length} · Correct answers: ${correct} · Incorrect or unanswered: ${qs.length - correct}</p><button class="btn" type="button" onclick="restartQuiz()">Try Again</button></div>`;
}
function restartQuiz() { i = 0; answers = []; draw(); }

window.pick = pick;
window.prev = prev;
window.next = next;
window.restartQuiz = restartQuiz;
draw();
