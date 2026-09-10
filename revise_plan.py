import json,copy
from pathlib import Path
p=Path(__file__).parent/'dist'
old=json.loads((p/'apartment.config.json').read_text())
c=copy.deepcopy(old);c['schemaVersion']=2;c['name']='역삼푸르지오 24평 · 2호 라인 · STEP 1';c['orientation']='line2-mirrored-x';c['stage']='STEP 1 / 사용자 검토 대기';c['geometryStatus']='candidate-not-surveyed';c['walls']=[];c['extensions']=[];c['fixtures']=[]
c['review']={'mirrorAxisX':3975,'mirrorFormula':'x_new = 7950 - x_old','sourceImage':{'file':'floorplan.png','width':538,'height':435},'overlay':{'scale':38.1,'offsetX':-6642.3,'offsetY':-2476.5,'rotation':0,'opacity':0.45},'notes':['벽 중심선 기준 해석. 도면 치수선이 내측/외측/중심선인지 미확인.','2호 라인 방향은 사용자 확인. 실제 시공 일치 여부는 미확인.','확장 전 원본 경계 복원 후보. 확장 설계는 STEP 3에서 검토.','균일 배율만 사용. 이미지 왜곡을 geometry 변경으로 맞추지 않음.','하단 발코니 곡면과 상단 창호 상세는 미확정. 직선 기준선을 점선으로 표시.'], 'checks':[]}
c['dimensionEvidence']=[{'id':'D01','kind':'printed-derived','value':7950,'formula':'10750 - 2800 = 7950','meaning':'세대 가로 기준폭','status':'도면 표기에서 계산 / 실측 아님'},{'id':'D02','kind':'printed-chain','value':11205,'formula':'1325 + 2305 + 1660 + 1430 + 3235 + 1250 = 11205','meaning':'오른쪽 세로 치수 체인','status':'원본 표기 / 실측 아님'},{'id':'D03','kind':'printed-chain','value':[2650,2600,2700],'meaning':'상단 가로 구간(공용부 제외)'},{'id':'D04','kind':'printed-chain','value':[4150,3800],'meaning':'하단 거실·침실1 가로 구간'}]
# Author in source (line 1) coordinates, then materialize every point in line 2.
def w(id,name,a,b,openings=[],kind='wall',evidence='image-estimated',note='중심선 위치는 표기 치수와 이미지 대조. 세부 치수는 미실측.',ext=False):
 c['walls'].append({'id':id,'name':name,'a':a,'b':b,'external':ext,'thickness':200 if ext else 150,'kind':kind,'evidence':evidence,'note':note,'openings':openings})
def d(id,start,width,hinge='end',swing=90,note='출입 위치·회전호는 원본 식별. 폭/이격거리는 이미지 추정.'):
 return {'id':id,'type':'door','start':start,'width':width,'hinge':hinge,'swing':swing,'open':True,'evidence':'image-estimated','symbolEvidence':'visible','note':note}
def win(id,start,width,note='유리/창호 기호 위치 추정. 창틀 분할·열림 방식 미확인.'):
 return {'id':id,'type':'window','start':start,'width':width,'evidence':'image-estimated','note':note}
w('west','현관측 외벽',[0,500],[0,11205],[d('entry',4750,1150,'start',90)],ext=True)
w('north-bed3','발코니3 외측 기준',[0,500],[2050,500],[win('w-bal3',120,1800)],'unresolved',note='원본 상단 선이 창호/난간인지 구별 불충분. 외측 기준선 후보.',ext=True)
w('north-step','발코니3/2 단차',[2050,0],[2050,1785])
w('north','발코니2 외측 기준',[2050,0],[7250,0],[win('w-kitchen-out',1150,1850),win('w-bed2-out',3350,1750)],'unresolved',ext=True)
w('north-east-step','우측 상단 단차',[7250,0],[7250,275],ext=True)
w('north-east','우측 상단 짧은 외벽',[7250,275],[7950,275],ext=True)
w('east','반대측 외벽',[7950,275],[7950,11205],evidence='dimension-constrained',ext=True)
w('south','발코니1 외측 기준',[0,11205],[7950,11205],[win('w-living-out',300,3500),win('w-bed1-out',4550,3050)],'unresolved',note='표기 11205 끝점 기준. 거실 앞 곡선 돌출은 반지름/치수 미상으로 아직 미모델링.',ext=True)
w('bed3-east','침실3 동측 벽',[2650,1785],[2650,5300],note='기존 동측 문 제거. 주방 하부장 선은 벽으로 추가하지 않음.')
w('bed3-south','침실3 거실측 벽',[0,4800],[2650,4800],[d('door-bed3',1600,1000,'end',90)],note='문은 남측 우단. z4800은 이미지 추정이며 표기 치수 아님.')
w('spine','침실2·욕실1·욕실2 주방측 벽',[5250,1325],[5250,6720],[d('door-bed2',1425,850,'end',90),d('door-bath1',3295,650,'end',90)],evidence='dimension-constrained',note='X=2650+2600. 욕실2 서측 문 제거. 시작 z1325는 상단 발코니 경계.')
w('bed2-south','침실2 / 욕실1 경계',[5250,3630],[7950,3630],evidence='dimension-constrained',note='z=1325+2305')
w('bath-divider','욕실1 / 욕실2 경계',[5250,5290],[7950,5290],evidence='dimension-constrained',note='z=1325+2305+1660')
w('bed1-north','침실1 거실·욕실2측 벽',[4150,6720],[7950,6720],[d('door-bed1',100,950,'start',90),d('door-bath2',2050,650,'end',90)],evidence='dimension-constrained',note='욕실2는 침실1에서 진입. 욕실2 북향 개방 회전호 식별. 두 문 간 잔여 벽 길이 실측 필요.')
w('bed1-west','침실1 거실측 벽',[4150,6720],[4150,9955],evidence='dimension-constrained')
w('bal1-divider','발코니1 중간 경계',[4150,9955],[4150,11205],kind='unresolved',note='원본 경계 상세 미식별. STEP 3에서 철거 여부 검토.')
w('bal3-inner','침실3 / 발코니3 기존 경계',[0,1785],[2050,1785],[win('glaze-bed3',100,1850)],'balcony-boundary')
w('shaft-bottom','상단 박스 하단',[2050,1785],[3400,1785],note='원본 X 표시 박스. 설비 종류·구조체 여부 미확인.')
w('shaft-top','상단 박스 상단',[2050,1250],[3400,1250])
w('shaft-right','상단 박스 우측',[3400,1250],[3400,1785])
w('bal2-kitchen','주방 / 발코니2 기존 경계',[3400,1785],[5250,1785],[win('glaze-kitchen',50,1750)],'balcony-boundary',note='원본 경계선 확인. 슬라이딩 등 개폐 방식 미확정. 여닫이문으로 만들지 않음.')
w('bal2-bed2','침실2 / 발코니2 기존 경계',[5250,1325],[7950,1325],[win('glaze-bed2',150,2350)],'balcony-boundary',evidence='dimension-constrained')
w('bal1-living','거실 / 발코니1 기존 경계',[0,9550],[4150,9550],[win('glaze-living',100,3950)],'balcony-boundary',note='거실측 경계는 이미지 y316에 해당하는 약9550. 침실1측 9955와 다름.')
w('bal1-bed1','침실1 / 발코니1 기존 경계',[4150,9955],[7950,9955],[win('glaze-bed1',180,3300)],'balcony-boundary',evidence='dimension-constrained')
c['rooms']=[]
for id,name,rect in [('bed3','침실 3',[0,1785,2650,4800]),('kitchen','주방 / 식당',[2650,1785,5250,5300]),('bed2','침실 2',[5250,1325,7950,3630]),('bath1','욕실 1',[5250,3630,7950,5290]),('bath2','욕실 2',[5250,5290,7950,6720]),('living','거실',[0,6000,4150,9550]),('bed1','침실 1',[4150,6720,7950,9955]),('entry','현관',[0,5300,1450,6400]),('bal3','발코니 3',[0,500,2050,1785]),('bal2','발코니 2',[3400,0,7950,1325]),('bal1','발코니 1',[0,9955,7950,11205])]:c['rooms'].append({'id':id,'name':name,'rect':rect,'evidence':'label-zone-estimated','note':'방명 표시용 영역. 면적 산출/벽 생성에 사용하지 않음.'})
for id,space,before,after,status in [('door-bed3','침실3','동측 벽에 임의 문','남측 벽 우단 / 침실 안쪽으로 열림','원본 회전호 식별'),('door-bed2','침실2','서측 출입','서측 하단 / 침실 안쪽으로 열림','위치·회전호 식별'),('door-bath1','욕실1','서측 중앙 출입','서측 하단 / 욕실 안쪽으로 열림','위치·회전호 식별'),('door-bath2','욕실2','서측 주방에서 출입','남측 / 침실1에서 진입, 욕실 안쪽 열림','출입 관계 교정'),('door-bed1','침실1','상측 좌단 출입','상측 좌단 / 침실 안쪽 열림','위치·회전호 식별'),('entry','현관','닫힌 개구부만 표현','서측 / 공용 전실로 열림','회전호 식별'),('kitchen-open','주방 / 식당','거실과 개방 연결','독립 여닫이문 기호 없음 / 추가하지 않음','개방 유지')]:c['review']['checks'].append({'id':id,'space':space,'before':before,'sourceLine1':after,'result':status,'confidence':'문 위치/방향은 기호 판독, mm 폭·이격거리는 추정','confirmed':False})
# Mirror coordinates physically. Keep a→b order, hence opening distances unchanged; reverse handedness.
def mirror(o):
 o=copy.deepcopy(o);M=7950
 for r in o.get('rooms',[])+o.get('extensions',[]):
  a,b,cc,d=r['rect'];r['rect']=[M-cc,b,M-a,d]
 for ww in o['walls']:
  ww['a'][0]=M-ww['a'][0];ww['b'][0]=M-ww['b'][0]
  for oo in ww['openings']:
   if 'swing' in oo:oo['swing']=-oo['swing']
 o['spawn'][0]=M-o['spawn'][0]
 for f in o.get('fixtures',[]):f['position'][0]=M-f['position'][0]
 return o
(p/'previous.config.json').write_text(json.dumps(mirror(old),ensure_ascii=False,indent=2))
(p/'apartment.config.json').write_text(json.dumps(mirror(c),ensure_ascii=False,indent=2))
ass={'schemaVersion':2,'status':'STEP 1 사용자 검토 전 / 실측 정확도 미확정','items':[{'id':'A01','subject':'치수 기준','detail':'7950 × 11205 및 가로/세로 치수 체인은 표기 기반. 벽 중심선 기준 여부 미확인. 도면 표기와 실측 확정을 구분.'},{'id':'A02','subject':'문 교정','detail':'침실3 동측 문 삭제 후 남측으로 이동. 욕실2 서측 문 삭제 후 침실1측 남측으로 이동. 모든 문폭·이격거리는 이미지 추정.'},{'id':'A03','subject':'창·발코니','detail':'원본의 유리/창호 경계선 후보 표시. 개폐 방식과 상단 외측 창호/난간 판독 미확정. 발코니 경계를 복원한 원본 검토안이며 확장안 확정 아님.'},{'id':'A04','subject':'단차·곡선·박스','detail':'상단 단차 및 X 표시 박스 위치는 추정. 하단 곡면은 치수 부족으로 미모델링하고 기준선만 표시. 20~24층 특화형 제외.'},{'id':'A05','subject':'2호 라인','detail':'X=7950-X로 벽 양 끝점·방·시작점·설비 좌표를 데이터에서 변환. 문 회전 부호 반전. 현관은 화면 오른쪽, 침실1/욕실은 왼쪽. 세대 차이에 따른 추가 구조 차이는 실측 필요.'},{'id':'A06','subject':'검증 단계','detail':'STEP 1. 3D/확장/가구는 미갱신 보관. 이번 데이터는 검토 후보이며 사용자 검토 없이 다음 단계로 진행하지 않음.'}]}
(p/'assumptions.json').write_text(json.dumps(ass,ensure_ascii=False,indent=2))
