import json
from pathlib import Path
p=Path(__file__).parent.parent/'dist'
c={'schemaVersion':1,'units':'mm','name':'역삼푸르지오 24평 · 확장 검토안','settings':{'ceilingHeight':2300,'eyeHeight':1600,'playerRadius':180,'speed':1800,'wallThickness':150,'externalWallThickness':200,'doorHeight':2050,'windowSill':850,'windowHeight':1300,'snap':50},'sourceDimensions':{'overallWidthIncludingCommon':10750,'commonWidth':2800,'upperSegments':[2800,2650,2600,2700],'lowerSegments':[2800,4150,3800],'rightSegments':[1325,2305,1660,1430,3235,1250],'totalDepth':11205},'bounds':[0,0,7950,11205],'spawn':[1900,7000],'rooms':[],'walls':[],'extensions':[]}
# Coordinates: x right, z down from apartment envelope's upper left. Centerline approximation.
for id,n,b,col in [('bed3','침실 3',[0,500,2650,4750],'#eee9df'),('kitchen','주방 / 식당',[2650,0,5250,4750],'#eeeae2'),('bed2','침실 2',[5250,0,7950,3630],'#ece7dd'),('bath1','욕실 1',[5250,3630,7950,5290],'#d4e3e7'),('bath2','욕실 2',[5250,5290,7950,6720],'#d4e3e7'),('living','거실',[0,4750,4150,11205],'#f0eade'),('hall','거실 통로',[4150,4750,5250,6720],'#f0eade'),('bed1','침실 1',[4150,6720,7950,11205],'#eee7dc')]:c['rooms'].append({'id':id,'name':n,'rect':b,'color':col})
def wall(id,a,b,ext=False,openings=[]):c['walls'].append({'id':id,'a':a,'b':b,'external':ext,'openings':openings})
def win(start,width):return {'type':'window','start':start,'width':width}
def door(start,width=850):return {'type':'door','start':start,'width':width,'open':True}
wall('west',[0,500],[0,11205],True,[{'type':'entry','start':4550,'width':950}])
wall('north-bed3',[0,500],[2650,500],True,[win(350,1950)])
wall('north-step',[2650,0],[2650,500],True)
wall('north',[2650,0],[7950,0],True,[win(400,1750),win(3000,1950)])
wall('east',[7950,0],[7950,11205],True)
wall('south',[0,11205],[7950,11205],True,[win(350,3400),win(4550,3000)])
wall('bed3-east',[2650,500],[2650,4750],False,[door(3250,900)])
wall('bed3-south',[0,4750],[2650,4750])
wall('east-spine',[5250,0],[5250,6720],False,[door(2550),door(4140,750),door(5540,750)])
wall('bed2-south',[5250,3630],[7950,3630])
wall('bath-divider',[5250,5290],[7950,5290])
wall('bed1-north',[4150,6720],[7950,6720],False,[door(200,900)])
wall('bed1-west',[4150,6720],[4150,11205])
c['extensions']=[{'id':'balcony1','name':'발코니 1 확장','rect':[0,9955,7950,11205]},{'id':'balcony2','name':'발코니 2 확장','rect':[2650,0,7950,1325]},{'id':'balcony3','name':'발코니 3 확장','rect':[0,500,2650,1785]}]
json.dump(c,open(p/'apartment.config.json','w'),ensure_ascii=False,indent=2)
a={'schemaVersion':1,'status':'실측 전 개념 검토 모델','source':'첨부 중개 평면도. 원본의 구조도/창호표/실측 치수 없음.','items':[{'id':'A01','subject':'치수 기준','confidence':'medium','detail':'10750-2800=7950 가로 및 오른쪽 세로 체인 11205 사용. 치수선이 벽 중심/외측/내측 중 어느 기준인지 미확인. 모델은 벽 중심선 기준. 실내 유효 치수는 벽 두께만큼 줄어든다.'},{'id':'A02','subject':'벽 두께·높이','confidence':'assumed','detail':'내벽150 외벽200 천장2300 눈높이1600mm. settings에서 수정.'},{'id':'A03','subject':'좌측·중앙 구획','confidence':'low','detail':'침실3 남쪽 z4750, 북쪽 z500, 주방 개방부 및 거실 통로는 이미지 비율로 추정. 왼쪽 치수는 공용 계단 구역도 포함하여 내부 방 깊이에 직접 적용하지 않음.'},{'id':'A04','subject':'문·창문','confidence':'low','detail':'위치 폭 문높이 창턱은 이미지 추정. 문은 열린 상태로 통행 가능. 현관은 닫힌 경계로 처리. 창문은 충돌 경계. 문틀 개구부와 열린 문짝을 표현.'},{'id':'A05','subject':'발코니 확장','confidence':'scenario','detail':'발코니1·2·3 모두 바닥 통합. 기존 경계벽 제거는 사용자 요청의 가상 시나리오이며 구조적 철거 가능성을 의미하지 않음. 구조 기둥/내력벽은 원본 식별 불가로 미확정. 곡선 전면 발코니는 직선화, 침실2 우측 20~24층 특화형 돌출부 미적용.'},{'id':'A06','subject':'가구·설비','confidence':'assumed','detail':'초기에는 가구 없음. 추가 메뉴 치수는 배치 검토용 예시이며 실제 제품 치수 아님. 욕실 기구·주방 배관/덕트/단차 미확정.'},{'id':'A07','subject':'외곽·면적','confidence':'low','detail':'발코니와 공용부분 경계를 도면 이미지로 해석. 24평은 명칭이며 모델 바닥면적을 전용면적 또는 계약면적으로 해석하지 않음.'}]}
json.dump(a,open(p/'assumptions.json','w'),ensure_ascii=False,indent=2)
f={'schemaVersion':1,'units':'mm','catalog':[{'type':'sofa','name':'소파','size':[2200,800,900],'color':'#b1b5b1'},{'type':'bed','name':'침대','size':[1500,550,2100],'color':'#ded6c9'},{'type':'table','name':'식탁 / 책상','size':[1400,750,800],'color':'#b89b77'},{'type':'wardrobe','name':'옷장','size':[1600,2100,600],'color':'#e5e2dc'},{'type':'fridge','name':'냉장고','size':[900,1800,750],'color':'#c1c9cc'},{'type':'cabinet','name':'주방 하부장','size':[1800,850,600],'color':'#e7e6e1'}],'items':[]}
json.dump(f,open(p/'furniture.json','w'),ensure_ascii=False,indent=2)
